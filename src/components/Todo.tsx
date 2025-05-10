'use client';

import { useState, useEffect, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  fetchChecklist,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  scheduleChecklistItem,
  ChecklistItem,
  getChecklistSuggestion,
} from '@/services/api';
import { useParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Todo() {
  const params = useParams();
  const planId = params?.planId as string;
  const [todos, setTodos] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Task type state (daily or longterm)
  const [taskType, setTaskType] = useState<'daily' | 'longterm'>('daily');

  const [newTodo, setNewTodo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Scheduling state
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  // AI suggestion state
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [displaySuggestion, setDisplaySuggestion] = useState('');
  const [isSuggestionTyping, setIsSuggestionTyping] = useState(false);
  const [isFetchingSuggestion, setIsFetchingSuggestion] = useState(false);

  // Typing animation state
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [fullText, setFullText] = useState('');
  const typingSpeed = 15; // milliseconds per character (faster)

  // New todo animation state
  const [newTodoAnimations, setNewTodoAnimations] = useState<{
    [id: string]: boolean;
  }>({});

  // Fetch todos on component mount and when planId or taskType changes
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const response = await fetchChecklist(planId, taskType);
        setTodos(response.result || []);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch checklist items:', error);
        setError('Failed to load tasks. Please try again later.');
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [planId, taskType]); // Re-fetch when planId or taskType changes

  // Handle typing animation for input
  useEffect(() => {
    if (!isTyping || typingIndex >= fullText.length) return;

    const timeout = setTimeout(() => {
      setNewTodo(fullText.slice(0, typingIndex + 1));
      setTypingIndex((prevIndex) => prevIndex + 1);
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [isTyping, typingIndex, fullText]);

  // End typing animation when complete
  useEffect(() => {
    if (isTyping && typingIndex >= fullText.length) {
      setIsTyping(false);
    }
  }, [typingIndex, fullText, isTyping]);

  // Handle typing animation for suggestion display
  useEffect(() => {
    if (!isSuggestionTyping || !suggestion) return;

    let currentIndex = 0;
    setDisplaySuggestion('');

    const interval = setInterval(() => {
      if (currentIndex < suggestion.length) {
        setDisplaySuggestion((prev) => prev + suggestion[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsSuggestionTyping(false);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [isSuggestionTyping, suggestion, typingSpeed]);

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
        todo.id === id ? { ...todo, done: newDoneStatus } : todo
      )
    );

    try {
      // API update
      const response = await updateChecklistItem(
        id,
        { done: newDoneStatus },
        planId,
        taskType
      );
      if (response.result !== 'success') {
        // Revert if failed
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, done: todoToToggle.done } : todo
          )
        );
        setError('Failed to update task status. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      // Revert if exception
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, done: todoToToggle.done } : todo
        )
      );
      setError('Failed to update task status. Please try again.');
    }
  };

  // Start scheduling a todo
  const startScheduling = (todo: ChecklistItem) => {
    setSchedulingId(todo.id);
    setScheduleDate(
      todo.scheduledTime ? new Date(todo.scheduledTime) : new Date()
    );
  };

  // Cancel scheduling
  const cancelScheduling = () => {
    setSchedulingId(null);
    setScheduleDate(null);
  };

  // Schedule a todo
  const scheduleTodo = async () => {
    if (!schedulingId || !scheduleDate) return;

    // Find the original todo
    const todoToSchedule = todos.find((todo) => todo.id === schedulingId);
    if (!todoToSchedule) return;

    // Store the original scheduledTime
    const originalScheduledTime = todoToSchedule.scheduledTime;

    // Optimistic update
    setIsScheduling(true);
    setTodos(
      todos.map((todo) =>
        todo.id === schedulingId
          ? { ...todo, scheduledTime: scheduleDate.toISOString() }
          : todo
      )
    );

    try {
      // API update
      const response = await scheduleChecklistItem(
        schedulingId,
        planId,
        scheduleDate,
        taskType
      );

      if (response.result !== 'success') {
        // Revert if failed
        setTodos(
          todos.map((todo) =>
            todo.id === schedulingId
              ? { ...todo, scheduledTime: originalScheduledTime }
              : todo
          )
        );
        setError('Failed to schedule task. Please try again.');
      }
    } catch (error) {
      console.error('Error scheduling todo:', error);
      // Revert if exception
      setTodos(
        todos.map((todo) =>
          todo.id === schedulingId
            ? { ...todo, scheduledTime: originalScheduledTime }
            : todo
        )
      );
      setError('Failed to schedule task. Please try again.');
    } finally {
      setIsScheduling(false);
      setSchedulingId(null);
      setScheduleDate(null);
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
    setEditText('');
  };

  // Format date for display
  const formatScheduleTime = (dateString: string) => {
    const date = new Date(dateString);

    // Format: "Today at 3:00 PM" or "Tomorrow at 3:00 PM" or "Mon, Jan 1 at 3:00 PM"
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeString = date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

    if (isToday) {
      return `Today at ${timeString}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${timeString}`;
    } else {
      return `${date.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })} at ${timeString}`;
    }
  };

  // Update todo description
  const updateTodoDescription = async (id: string) => {
    if (editText.trim() === '') return;

    // Find the original todo
    const originalTodo = todos.find((todo) => todo.id === id);
    if (!originalTodo) return;

    const originalText = originalTodo.description;

    // Optimistic update
    setIsUpdating(true);

    const updatedText = editText.trim();

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, description: updatedText } : todo
      )
    );

    try {
      // API update
      const response = await updateChecklistItem(
        id,
        {
          description: editText.trim(),
        },
        planId,
        taskType
      );

      if (response.result !== 'success') {
        // Revert if failed
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, description: originalText } : todo
          )
        );
        setError('Failed to update task. Please try again.');
      }
    } catch (error) {
      console.error('Error updating todo description:', error);
      // Revert if exception
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, description: originalText } : todo
        )
      );
      setError('Failed to update task. Please try again.');
    } finally {
      setIsUpdating(false);
      setEditingId(null);
      setEditText('');
    }
  };

  // Add a new todo
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    try {
      setIsSubmitting(true);
      // optimistic temp item
      const tempId = `id_${Date.now()}`;
      const tempNewItem: ChecklistItem = {
        id: tempId,
        description: newTodo,
        done: false,
      };

      // Start animation for the new todo
      setNewTodoAnimations((prev) => ({ ...prev, [tempId]: true }));

      const optimisticUpdatedTodos = [...todos, tempNewItem];
      setTodos(optimisticUpdatedTodos);

      const newItem = await createChecklistItem(
        newTodo.trim(),
        planId,
        taskType
      );

      // update the newly created todo with the one from the API to sync the id
      setTodos(
        optimisticUpdatedTodos.map((todo) =>
          todo.id === tempId ? newItem : todo
        )
      );

      setNewTodo('');
      setError(null);
      // Clear suggestion after adding a todo
      setSuggestion(null);
      setDisplaySuggestion('');
    } catch (error) {
      console.error('Failed to create checklist item:', error);
      setError('Failed to add task. Please try again.');

      // Create a local ID for the fallback item
      const fallbackId = `fallback_${Date.now()}`;

      // Fallback: add item locally if API fails
      const fallbackItem = {
        id: fallbackId,
        description: newTodo.trim(),
        done: false,
      };
      setTodos([...todos, fallbackItem]);
      setNewTodo('');

      // Add animation for the fallback item
      setNewTodoAnimations((prev) => ({
        ...prev,
        [fallbackId]: true,
      }));

      // Remove animation after a delay
      setTimeout(() => {
        setNewTodoAnimations((current) => {
          const final = { ...current };
          delete final[fallbackId];
          return final;
        });
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get AI suggestion for a new todo
  const getAISuggestion = async () => {
    try {
      setIsFetchingSuggestion(true);
      setError(null);
      const response = await getChecklistSuggestion(planId, taskType);

      // Start typing animation for the suggestion
      setSuggestion(response.result);
      setDisplaySuggestion('');
      setIsSuggestionTyping(true);
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
      setError('Failed to get AI suggestion. Please try again.');
    } finally {
      setIsFetchingSuggestion(false);
    }
  };

  // Start typing animation for the suggestion
  const useSuggestion = () => {
    if (suggestion) {
      // Clear current input and prepare for typing animation
      setNewTodo('');
      setFullText(suggestion);
      setTypingIndex(0);
      setIsTyping(true);
      setSuggestion(null);
      setDisplaySuggestion('');
    }
  };

  console.log('@Debug todos:', todos);

  // Delete a todo
  const deleteTodo = async (id: string) => {
    // Find the original todo before removing it
    const todoToDelete = todos.find((todo) => todo.id === id);
    if (!todoToDelete) return;

    // Optimistic deletion
    setTodos(todos.filter((todo) => todo.id !== id));

    try {
      const response = await deleteChecklistItem(id, planId, taskType);
      if (response.result !== 'success') {
        // Restore if deletion failed
        setTodos((prevTodos) => [...prevTodos, todoToDelete]);
        setError('Failed to delete task. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      // Restore if exception
      setTodos((prevTodos) => [...prevTodos, todoToDelete]);
      setError('Failed to delete task. Please try again.');
    }
  };

  if (loading) {
    return <div className="py-4">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Section Title with Task Type Switcher */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {taskType === 'daily' ? 'Daily' : 'Long-term'}
        </h2>
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => setTaskType('daily')}
            className={`transition-colors hover:opacity-80 ${
              taskType === 'daily' ? 'font-medium' : 'opacity-60'
            }`}
            style={{ color: taskType === 'daily' ? 'rgb(247, 111, 83)' : '' }}
          >
            Daily
          </button>
          <span className="opacity-30">|</span>
          <button
            onClick={() => setTaskType('longterm')}
            className={`transition-colors hover:opacity-80 ${
              taskType === 'longterm' ? 'font-medium' : 'opacity-60'
            }`}
            style={{
              color: taskType === 'longterm' ? 'rgb(247, 111, 83)' : '',
            }}
          >
            Long-term
          </button>
        </div>
      </div>

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
            placeholder={`Add a new ${
              taskType === 'daily' ? 'task' : 'goal'
            }...`}
            className="flex-1 p-2 border rounded"
            style={{ backgroundColor: 'transparent' }}
            disabled={isSubmitting || isTyping}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-white/5 dark:bg-gray-900/10"
            style={{ color: 'rgb(247, 111, 83)' }}
            disabled={isSubmitting || isTyping}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </form>

        <div className="flex justify-between items-center">
          <button
            onClick={getAISuggestion}
            disabled={isFetchingSuggestion || isTyping || isSuggestionTyping}
            className="text-sm text-gray-600 flex items-center px-3 py-1.5 rounded-md transition-colors bg-white/5"
          >
            {isFetchingSuggestion ? (
              'Getting suggestion...'
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

        {/* AI Suggestion Component */}
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
                  <p className="mt-1">
                    {isSuggestionTyping ? displaySuggestion : suggestion}
                    {isSuggestionTyping && (
                      <span className="animate-pulse">|</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={useSuggestion}
                disabled={isTyping || isSuggestionTyping}
                className="ml-4 px-2.5 py-0.5 h-[30px] text-xs font-medium rounded bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                Use suggestion
              </button>
            </div>
          </div>
        )}
      </div>

      {todos.length === 0 ? (
        <div className="py-4 text-center">
          <p className="text-gray-500 text-sm">
            {taskType === 'daily'
              ? 'No daily tasks yet. Add one above!'
              : 'No long-term goals yet. Add one above!'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3 mt-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center justify-between group transition-all duration-200 ${
                newTodoAnimations[todo.id] ? 'animate-fadeIn' : ''
              }`}
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
                      style={{ backgroundColor: 'transparent' }}
                      disabled={isUpdating}
                    />
                    <button
                      onClick={() => updateTodoDescription(todo.id)}
                      className="px-2 py-1 text-xs rounded bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/60 border border-orange-200 dark:border-orange-800"
                      style={{ color: 'rgb(247, 111, 83)' }}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save'}
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
              ) : schedulingId === todo.id ? (
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.done}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <div className="flex flex-1 flex-wrap space-x-2">
                    <label
                      className={`text-sm cursor-pointer flex-1 ${
                        todo.done ? 'line-through opacity-70' : ''
                      }`}
                    >
                      {todo.description}
                    </label>
                    <div className="mt-2 flex items-center space-x-2 w-full">
                      <DatePicker
                        selected={scheduleDate}
                        onChange={(date) => setScheduleDate(date)}
                        showTimeSelect
                        timeFormat="h:mm aa"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="text-sm p-2 border rounded flex-grow bg-transparent"
                        placeholderText="Select date and time"
                        disabled={isScheduling}
                      />
                      <button
                        onClick={scheduleTodo}
                        className="px-2 py-1 text-xs rounded bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/60 border border-orange-200 dark:border-orange-800"
                        style={{ color: 'rgb(247, 111, 83)' }}
                        disabled={isScheduling || !scheduleDate}
                      >
                        {isScheduling ? 'Saving...' : 'Schedule'}
                      </button>
                      <button
                        onClick={cancelScheduling}
                        className="px-2 py-1 text-xs rounded bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900/80 border border-gray-200 dark:border-gray-700"
                        disabled={isScheduling}
                      >
                        Cancel
                      </button>
                    </div>
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
                    <div className="flex flex-col flex-1">
                      <label
                        className={`text-sm cursor-pointer flex-1 ${
                          todo.done ? 'line-through opacity-70' : ''
                        } ${newTodoAnimations[todo.id] ? 'relative' : ''}`}
                      >
                        {todo.description}
                        {newTodoAnimations[todo.id] && (
                          <span className="absolute -right-1 bottom-0 h-5 w-0.5 bg-orange-400 dark:bg-orange-500 animate-cursor"></span>
                        )}
                      </label>
                      {todo.scheduledTime && (
                        <div className="mt-1 text-xs flex items-center text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3 h-3 mr-1 text-orange-400"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatScheduleTime(todo.scheduledTime)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    {/* Schedule Icon */}
                    <button
                      onClick={() => startScheduling(todo)}
                      title="Schedule this task"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={{
                        color: todo.scheduledTime
                          ? 'rgb(247, 111, 83)'
                          : 'rgb(150, 150, 150)',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Edit Icon */}
                    <button
                      onClick={() => startEditing(todo)}
                      title="Edit task"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={{ color: 'rgb(247, 111, 83)' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>

                    {/* Delete Icon */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      title="Delete task"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={{ color: 'rgb(247, 111, 83)' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes cursorBlink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-cursor {
          animation: cursorBlink 0.8s infinite;
        }
      `}</style>
    </div>
  );
}
