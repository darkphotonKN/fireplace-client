"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  fetchChecklist,
  createChecklistItem,
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

  // Fetch todos on component mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const response = await fetchChecklist();
        setTodos(response.result || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch checklist items:", err);
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

  // Toggle todo completion status (client-side only for now)
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // Add a new todo
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    try {
      setIsSubmitting(true);
      const newItem = await createChecklistItem(newTodo.trim());
      setTodos([...todos, newItem]);
      setNewTodo("");
      setError(null);
    } catch (err) {
      console.error("Failed to create checklist item:", err);
      setError("Failed to add task. Please try again.");

      // Fallback: add item locally if API fails
      const fallbackItem = {
        id: Date.now().toString(),
        description: newTodo.trim(),
        completed: false,
      };
      setTodos([...todos, fallbackItem]);
      setNewTodo("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a todo (client-side only for now)
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
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
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`text-sm ${todo.completed ? "line-through opacity-70" : ""
                    }`}
                >
                  {todo.description}
                </label>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-sm px-2"
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
