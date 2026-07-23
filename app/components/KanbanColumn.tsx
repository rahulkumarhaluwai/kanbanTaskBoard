"use client";

import { DragEvent, useState } from "react";
import TaskCard from "./TaskCard";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  assignedToId: string;
  assignedTo: User;
};

export default function KanbanColumn({
  title,
  status,
  tasks,
  users,
  isAdmin,
}: {
  title: string;
  status: string;
  tasks: Task[];
  users: User[];
  isAdmin: boolean;
}) {
  const [isOver, setIsOver] = useState(false);

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsOver(true);
  }

  function handleDragLeave() {
    setIsOver(false);
  }

  async function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsOver(false);

    const taskId = event.dataTransfer.getData("taskId");

    if (!taskId) return;

    const response = await fetch("/api/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: taskId,
        status,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error(data.error);
      return;
    }

    window.location.reload();
  }

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-200 ${
        isOver
          ? "scale-[1.01] border-gray-900 bg-gray-50 shadow-lg"
          : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">
            {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
          </p>
        </div>

        <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-gray-100 px-3 text-sm font-semibold text-gray-700">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-4 p-4">
        {tasks.length === 0 ? (
          <div
            className={`flex h-36 items-center justify-center rounded-xl border-2 border-dashed transition ${
              isOver ? "border-gray-900 bg-gray-100" : "border-gray-300"
            }`}
          >
            <p className="text-sm text-gray-500">Drop a task here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              isAdmin={isAdmin}
              onDragStart={(event) => {
                event.dataTransfer.setData("taskId", task.id);
              }}
            />
          ))
        )}
      </div>
    </section>
  );
}
