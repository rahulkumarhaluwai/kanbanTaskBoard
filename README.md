# Kanban Task Board

A responsive Kanban-style task board built with **Next.js (App Router)**, featuring credential-based authentication and server-enforced role-based access control (RBAC).

---

## Tech Stack

- **Framework:** Next.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS

---

## Features

- **Kanban board** with "To Do", "In Progress", and "Done" columns
- **Drag-and-drop / status update** to move tasks between columns
- **Authentication** via email + password login form
- **Role-based access control**, enforced on the server:
  - **Admin:** full CRUD — create, edit, reassign, update status, and delete any task
  - **Member:** can view the board and update the status of tasks assigned to them only; cannot create, reassign, or delete tasks

---

### Clone & install

```bash
git clone <https://github.com/rahulkumarhaluwai/kanbanTaskBoard>
cd <kanbanTaskBoard>
npm install
```

### Seed the database

Seeds 1 admin, 2+ members, and a set of starter tasks assigned across users:

```bash
npx prisma db seed
```

## Test Credentials

Use these pre-seeded accounts to log in and evaluate both roles:

| Role   | Email                | Password       |
|--------|----------------------|----------------|
| Admin  | admin@example.com    | Admin@123      |
| Member | rahul@kanban.com     | Member@123     |
| Member | sumit@kanban.com     | Member@123     |
