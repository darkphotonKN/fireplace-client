'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function Todo() {
  // State for todo list
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Complete React hooks tutorial', completed: false },
    { id: '2', text: 'Review TypeScript types', completed: false },
    { id: '3', text: 'Practice with Tailwind CSS', completed: true },
  ]);

  // State for new todo input
  const [newTodo, setNewTodo] = useState('');

  // Toggle todo completion status
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Add a new todo
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    const newItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
    };

    setTodos([...todos, newItem]);
    setNewTodo('');
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={addTodo} className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-2 border rounded"
          style={{ backgroundColor: 'transparent' }}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded"
          style={{ backgroundColor: 'rgb(247, 111, 83)', color: 'white' }}
        >
          Add
        </button>
      </form>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between group">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`text-sm ${
                  todo.completed ? 'line-through opacity-70' : ''
                }`}
              >
                {todo.text}
              </label>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-sm px-2"
              style={{ color: 'rgb(247, 111, 83)' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
