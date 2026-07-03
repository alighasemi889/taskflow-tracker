import { useMemo, useState } from "react";
import { Check, Clock, Lock, Plus, Trash2, X } from "lucide-react";
import { useTasks } from "./useTasks";
import { isLocked, statusOf, todayStr } from "./taskStatus";
import { USERS, type Task, type TaskStatus, type User } from "./types";

const STATUS_STYLES: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "Todo",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  done: {
    label: "Done",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  overdue: {
    label: "Overdue",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  },
};

const AVATAR_STYLES: Record<User, string> = {
  Ali: "bg-sky-100 text-sky-700",
  Nazanin: "bg-rose-100 text-rose-700",
  Mohammad: "bg-violet-100 text-violet-700",
};

function StatusBadge({ status }: { status: TaskStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.className}`}
    >
      {status === "todo" && <Clock className="h-3 w-3" />}
      {status === "done" && <Check className="h-3 w-3" />}
      {status === "overdue" && <Lock className="h-3 w-3" />}
      {s.label}
    </span>
  );
}

function TaskCard({
  task,
  currentUser,
  onToggle,
  onDelete,
}: {
  task: Task;
  currentUser: User;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const status = statusOf(task);
  const locked = isLocked(task);
  const ownsTask = task.assignedTo === currentUser;
  const canToggle = ownsTask && !locked;
  const deadlineLabel = new Date(task.deadline + "T00:00:00").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-sm font-medium leading-snug ${
            task.done ? "text-slate-400 line-through" : "text-slate-800"
          }`}
        >
          {task.title}
        </p>
        <StatusBadge status={status} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${AVATAR_STYLES[task.assignedTo]}`}
          >
            {task.assignedTo.slice(0, 2)}
          </span>
          <span className="font-medium text-slate-600">{task.assignedTo}</span>
          <span className="text-slate-300">·</span>
          <span>Due {deadlineLabel}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canToggle}
            onClick={() => onToggle(task.id)}
            title={
              locked
                ? "Locked: past deadline"
                : !ownsTask
                  ? "Only the assignee can complete this task"
                  : task.done
                    ? "Mark as todo"
                    : "Mark as done"
            }
            className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium transition ${
              canToggle
                ? task.done
                  ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  : "bg-slate-900 text-white hover:bg-slate-700"
                : "cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-300"
            }`}
          >
            {locked ? (
              <>
                <Lock className="h-3.5 w-3.5" /> Locked
              </>
            ) : task.done ? (
              <>
                <X className="h-3.5 w-3.5" /> Undo
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" /> Done
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NewTaskForm({ onAdd }: { onAdd: (t: string, u: User, d: string) => void }) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState<User>("Ali");
  const [deadline, setDeadline] = useState(todayStr());
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!deadline) {
      setError("Deadline is required");
      return;
    }
    onAdd(title, assignedTo, deadline);
    setTitle("");
    setDeadline(todayStr());
    setAssignedTo("Ali");
    setError("");
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 text-slate-800">
        <Plus className="h-4 w-4 text-slate-400" />
        <h2 className="text-sm font-semibold">Create task</h2>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Prepare quarterly report"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Assignee
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value as User)}
            className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            {USERS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Deadline
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" /> Add task
        </button>
      </div>
    </form>
  );
}

export default function App() {
  const { tasks, addTask, toggleDone, deleteTask } = useTasks();
  const [currentUser, setCurrentUser] = useState<User>("Ali");

  const grouped = useMemo(() => {
    const map: Record<User, Task[]> = {
      Ali: [],
      Nazanin: [],
      Mohammad: [],
    };
    for (const t of tasks) map[t.assignedTo].push(t);
    for (const u of USERS) {
      map[u].sort((a, b) => Number(statusOf(a) === "done") - Number(statusOf(b) === "done") || a.createdAt - b.createdAt);
    }
    return map;
  }, [tasks]);

  const counts = useMemo(() => {
    const c = { todo: 0, done: 0, overdue: 0 };
    for (const t of tasks) c[statusOf(t)]++;
    return c;
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">TaskFlow</h1>
              <p className="text-xs text-slate-500">Simple team task tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Viewing as</span>
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              {USERS.map((u) => (
                <button
                  key={u}
                  onClick={() => setCurrentUser(u)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    currentUser === u
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-5 grid grid-cols-3 gap-3">
          {(["todo", "done", "overdue"] as TaskStatus[]).map((s) => (
            <div
              key={s}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <p className="text-xs font-medium text-slate-500 capitalize">{s}</p>
              <p className="mt-0.5 text-2xl font-semibold text-slate-800">
                {counts[s]}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <NewTaskForm onAdd={addTask} />
        </div>

        <div className="space-y-6">
          {USERS.map((u) => (
            <section key={u}>
              <div className="mb-2.5 flex items-center gap-2">
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${AVATAR_STYLES[u]}`}
                >
                  {u.slice(0, 2)}
                </span>
                <h2 className="text-sm font-semibold text-slate-800">{u}</h2>
                <span className="text-xs text-slate-400">
                  {grouped[u].length} {grouped[u].length === 1 ? "task" : "tasks"}
                </span>
              </div>
              {grouped[u].length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-white/50 px-4 py-6 text-center text-xs text-slate-400">
                  No tasks assigned.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {grouped[u].map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      currentUser={currentUser}
                      onToggle={toggleDone}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
