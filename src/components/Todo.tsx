"use client";

import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  fetchChecklist,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  ChecklistItem,
  getChecklistSuggestion,
} from "@/services/api";

export default function Todo() {
  const [todos, setTodos] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTodo, setNewTodo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  // AI suggestion state
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isFetchingSuggestion, setIsFetchingSuggestion] = useState(false);

  // Fetch todos on component mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const response = await fetchChecklist();
        setTodos(response.result || []);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch checklist items:", error);
        setError("Failed to load tasks. Please try again later.");
        // Use sample data as fallback
        setTodos([
          {
            id: "1",
            description: "Complete React hooks tutorial",
            done: false,
          },
          { id: "2", description: "Review TypeScript types", done: false },
          {
            id: "3",
            description: "Practice with Tailwind CSS",
            done: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  // Focus on edit input when entering edit mode
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  // Toggle todo completion status
  const toggleTodo = async (id: string) => {
    // Find the todo
    const todoToToggle = todos.find((todo) => todo.id === id);
    if (!todoToToggle) return;

    // Optimistic update
    const newDoneStatus = !todoToToggle.done;
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: newDoneStatus } : todo,
      ),
    );

    try {
      // API update
      const response = await updateChecklistItem(id, { done: newDoneStatus });
      if (response.result !== "success") {
        // Revert if failed
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, done: todoToToggle.done } : todo,
          ),
        );
        setError("Failed to update task status. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
      // Revert if exception
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, done: todoToToggle.done } : todo,
        ),
      );
      setError("Failed to update task status. Please try again.");
    }
  };

  // Start editing a todo
  const startEditing = (todo: ChecklistItem) => {
    setEditingId(todo.id);
    setEditText(todo.description);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  // Update todo description
  const updateTodoDescription = async (id: string) => {
    if (editText.trim() === "") return;

    // Find the original todo
    const originalTodo = todos.find((todo) => todo.id === id);
    if (!originalTodo) return;

    const originalText = originalTodo.description;

    // Optimistic update
    setIsUpdating(true);

    const updatedText = editText.trim();

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, description: updatedText } : todo,
      ),
    );

    try {
      // API update
      const response = await updateChecklistItem(id, {
        description: editText.trim(),
      });

      if (response.result !== "success") {
        // Revert if failed
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, description: originalText } : todo,
          ),
        );
        setError("Failed to update task. Please try again.");
      }
    } catch (error) {
      console.error("Error updating todo description:", error);
      // Revert if exception
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, description: originalText } : todo,
        ),
      );
      setError("Failed to update task. Please try again.");
    } finally {
      setIsUpdating(false);
      setEditingId(null);
      setEditText("");
    }
  };

  // Add a new todo
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    try {
      setIsSubmitting(true);
      // optimistic temp item
      const tempId = `id_${Date.now()}`;
      const tempNewItem: ChecklistItem = {
        id: tempId,
        description: newTodo,
        done: false,
      };

      const optimisticUpdatedTodos = [...todos, tempNewItem];
      setTodos(optimisticUpdatedTodos);

      const newItem = await createChecklistItem(newTodo.trim());

      // update the newly created todo with the one from the API to sync the id
      const newTodos = optimisticUpdatedTodos.map((todo) =>
        todo.id === tempId ? newItem : todo,
      );

      setTodos(newTodos);

      // clear input
      setNewTodo("");
      setError(null);
      // Clear suggestion after adding a todo
      setSuggestion(null);
    } catch (error) {
      console.error("Failed to create checklist item:", error);
      setError("Failed to add task. Please try again.");

      // Fallback: add item locally if API fails
      const fallbackItem = {
        id: Date.now().toString(),
        description: newTodo.trim(),
        done: false,
      };
      setTodos([...todos, fallbackItem]);
      setNewTodo("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get AI suggestion for a new todo
  const getAISuggestion = async () => {
    try {
      setIsFetchingSuggestion(true);
      setError(null);
      const response = await getChecklistSuggestion();
      setSuggestion(response.result);
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
      setError("Failed to get AI suggestion. Please try again.");
    } finally {
      setIsFetchingSuggestion(false);
    }
  };

  // Use the suggestion as the new todo
  const useSuggestion = () => {
    if (suggestion) {
      setNewTodo(suggestion);
      setSuggestion(null);
    }
  };

  console.log("@Debug todos:", todos);

  // Delete a todo
  const deleteTodo = async (id: string) => {
    // Find the original todo before removing it
    const todoToDelete = todos.find((todo) => todo.id === id);
    if (!todoToDelete) return;

    // Optimistic deletion
    setTodos(todos.filter((todo) => todo.id !== id));

    try {
      const response = await deleteChecklistItem(id);
      if (response.result !== "success") {
        // Restore if deletion failed
        setTodos((prevTodos) => [...prevTodos, todoToDelete]);
        setError("Failed to delete task. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      // Restore if exception
      setTodos((prevTodos) => [...prevTodos, todoToDelete]);
      setError("Failed to delete task. Please try again.");
    }
  };

  if (loading) {
    return <div className="py-4">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <form onSubmit={addTodo} className="flex space-x-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border rounded"
            style={{ backgroundColor: "transparent" }}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-white/5 dark:bg-gray-900/10"
            style={{ color: "rgb(247, 111, 83)" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </form>

        <div className="flex justify-between items-center">
          <button
            onClick={getAISuggestion}
            disabled={isFetchingSuggestion}
            className="text-sm text-gray-600 flex items-center px-3 py-1.5 rounded-md transition-colors bg-white/5"
          >
            {isFetchingSuggestion ? (
              "Getting suggestion..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 mr-1.5"
                >
                  <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-.707 9.293a1 1 0 0 1 0 1.414 1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4z" />
                </svg>
                Get AI suggestion
              </>
            )}
          </button>
        </div>

        {suggestion && (
          <div className="mt-2 p-3 text-sm flex items-center px-3 py-1.5 rounded-md transition-colors bg-white/5 dark:bg-gray-900/10">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-gray-400 dark:text-gray-500"
                  >
                    <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" />
                  </svg>
                </div>
                <div className="ml-2 text-gray-600 text-sm">
                  <p className="font-medium">AI Suggestion</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {suggestion}
                  </p>
                </div>
              </div>
              <button
                onClick={useSuggestion}
                className="ml-4 px-2.5 py-0.5 h-[30px] text-xs font-medium rounded bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                Use suggestion
              </button>
            </div>
          </div>
        )}
      </div>

      {todos.length === 0 && !loading ? (
        <p className="text-gray-500 text-sm">No tasks yet. Add one above!</p>
      ) : (
        <ul className="space-y-3 mt-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between group"
            >
              {editingId === todo.id ? (
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.done}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <div className="flex flex-1 space-x-2">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border rounded"
                      style={{ backgroundColor: "transparent" }}
                      disabled={isUpdating}
                    />
                    <button
                      onClick={() => updateTodoDescription(todo.id)}
                      className="px-2 py-1 text-xs rounded bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/60 border border-orange-200 dark:border-orange-800"
                      style={{ color: "rgb(247, 111, 83)" }}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-2 py-1 text-xs rounded bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900/80 border border-gray-200 dark:border-gray-700"
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.done}
                      onCheckedChange={() => toggleTodo(todo.id)}
                    />
                    <label
                      className={`text-sm cursor-pointer flex-1 ${
                        todo.done ? "line-through opacity-70" : ""
                      }`}
                    >
                      {todo.description}
                    </label>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(todo)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-sm px-2"
                      style={{ color: "rgb(247, 111, 83)" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-sm px-2"
                      style={{ color: "rgb(247, 111, 83)" }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
