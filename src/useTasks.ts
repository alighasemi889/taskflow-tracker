import { useCallback, useEffect, useState } from "react";
import type { Task, User } from "./types";

const STORAGE_KEY = "task-tracker:tasks:v1";

function load(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => load());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback(
    (title: string, assignedTo: User, deadline: string) => {
      const task: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        assignedTo,
        deadline,
        done: false,
        createdAt: Date.now(),
      };
      setTasks((prev) => [task, ...prev]);
    },
    []
  );

  const toggleDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, addTask, toggleDone, deleteTask };
}
