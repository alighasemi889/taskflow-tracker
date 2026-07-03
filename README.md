# TaskFlow

A simple, SaaS-like team task tracker built with **React**, **TypeScript**, and **Tailwind CSS**. No backend — data persists in the browser via `localStorage`.

## Features

- **3 team members:** Ali, Nazanin, Mohammad
- **Admin task creation** with title, assignee, and deadline date
- **Automatic status** for every task:
  - `todo` — not yet completed and deadline not passed
  - `done` — completed by the assignee
  - `overdue` — deadline passed and not completed (locked)
- **Deadline locking** — once a task is overdue it cannot be marked as done
- **Per-user completion** — only the assigned user can mark their own task as done (use the "Viewing as" switcher in the header)
- **Grouped task list** — tasks are displayed under each user with avatars and counts
- **Summary dashboard** — todo / done / overdue counters at the top
- **localStorage persistence** — tasks survive page reloads

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- lucide-react (icons)

## Getting Started

```bash
npm install
npm run dev
```

Then open the local dev URL printed in the terminal.

### Build for production

```bash
npm run build
npm run preview
```

## How It Works

| Rule | Behavior |
| --- | --- |
| Status `todo` | Deadline not passed and task not done |
| Status `done` | Assignee marked the task complete |
| Status `overdue` | Today is past the deadline and task is not done |
| Locked | Overdue tasks show a disabled "Locked" button and cannot be completed |
| Own tasks only | The "Viewing as" switcher sets the current user; only that user can complete their assigned tasks |

## Project Structure

```
src/
  App.tsx        # Main UI: header, dashboard, form, grouped task list
  types.ts        # User, TaskStatus, Task types + USERS list
  useTasks.ts     # localStorage-backed tasks hook (add / toggle / delete)
  taskStatus.ts   # Date-based status + locking logic
  main.tsx        # React entry point
  index.css       # Tailwind directives
```

## License

MIT
