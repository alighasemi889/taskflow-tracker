export type User = "Ali" | "Nazanin" | "Mohammad";

export type TaskStatus = "todo" | "done" | "overdue";

export interface Task {
  id: string;
  title: string;
  assignedTo: User;
  deadline: string; // ISO date (yyyy-mm-dd)
  done: boolean;
  createdAt: number;
}

export const USERS: User[] = ["Ali", "Nazanin", "Mohammad"];
