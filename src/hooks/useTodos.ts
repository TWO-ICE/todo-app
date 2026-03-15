import { useState, useEffect } from "react";
import type { Todo } from "../types/todo";
import { mapPriorityToRarity, RARITY_CONFIGS } from "../config/gameConfig";

const STORAGE_KEY = "todos";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTodos(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse todos", e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  const addTodo = (text: string, priority: Todo["priority"]) => {
    const rarity = mapPriorityToRarity(priority);
    const xpReward = RARITY_CONFIGS[rarity].xpReward;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      rarity,
      xpReward,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const newCompleted = !todo.completed;
          return {
            ...todo,
            completed: newCompleted,
            completedAt: newCompleted ? Date.now() : undefined,
          };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  // 获取最近完成的任务（用于连击计算）
  const getRecentCompleted = (minutes: number = 5) => {
    const now = Date.now();
    const threshold = now - minutes * 60 * 1000;
    return todos.filter(
      (todo) => todo.completed && todo.completedAt && todo.completedAt >= threshold
    );
  };

  return {
    todos,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    getRecentCompleted,
  };
}
