import type { Task, TaskStatus } from "./types";

// "today" as a yyyy-mm-dd string in local time.
export function todayStr(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60_000);
  return local.toISOString().slice(0, 10);
}

// A task is overdue when today is past the deadline and it's not done.
export function isOverdue(task: Task): boolean {
  return !task.done && task.deadline < todayStr();
}

export function statusOf(task: Task): TaskStatus {
  if (task.done) return "done";
  if (isOverdue(task)) return "overdue";
  return "todo";
}

// Locked = overdue. Once past deadline and not done, it can't be marked done.
export function isLocked(task: Task): boolean {
  return isOverdue(task);
}
