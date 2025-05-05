"use client";

import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  fetchChecklist,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  ChecklistItem,
} from "@/services/api";

export default function Todo() {
  // State for todo list
  const [todos, setTodos] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for new todo input
  const [newTodo, setNewTodo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

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

      setError(null);
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

      <form onSubmit={addTodo} className="flex space-x-2 mb-4">
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
          className="px-4 py-2 rounded"
          style={{ backgroundColor: "rgb(247, 111, 83)", color: "white" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </form>

      {todos.length === 0 && !loading ? (
        <p className="text-gray-500 text-sm">No tasks yet. Add one above!</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.done}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />

                {editingId === todo.id ? (
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
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: "rgb(247, 111, 83)",
                        color: "white",
                      }}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700"
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center">
                    <label
                      onClick={() => startEditing(todo)}
                      className={`text-sm cursor-pointer flex-1 ${
                        todo.done ? "line-through opacity-70" : ""
                      }`}
                    >
                      {todo.description}
                    </label>
                    <button
                      onClick={() => startEditing(todo)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded"
                      style={{ color: "rgb(247, 111, 83)" }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-sm px-2 ml-2"
                style={{ color: "rgb(247, 111, 83)" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
