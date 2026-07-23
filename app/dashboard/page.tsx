import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";
import CreateTaskForm from "@/app/components/CreateTaskForm";
import KanbanColumn from "@/app/components/KanbanColumn";
export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where:
      session.user.role === "ADMIN"
        ? undefined
        : {
            assignedToId: session.user.id,
          },
    include: {
      assignedTo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const todoTasks = tasks.filter((task) => task.status === "TODO");

  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");

  const doneTasks = tasks.filter((task) => task.status === "DONE");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kanban Task Board
            </h1>

            <p className="mt-1 text-gray-500">
              Welcome back, {session.user.name}
            </p>

            <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {session.user.role}
            </span>
          </div>

          <LogoutButton />
        </div>
        {session.user.role === "ADMIN" && <CreateTaskForm />}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          <KanbanColumn
            title="To Do"
            status="TODO"
            tasks={todoTasks}
            users={users}
            isAdmin={session.user.role === "ADMIN"}
          />

          <KanbanColumn
            title="In Progress"
            status="IN_PROGRESS"
            tasks={inProgressTasks}
            users={users}
            isAdmin={session.user.role === "ADMIN"}
          />

          <KanbanColumn
            title="Done"
            status="DONE"
            tasks={doneTasks}
            users={users}
            isAdmin={session.user.role === "ADMIN"}
          />
        </div>
      </div>
    </main>
  );
}
