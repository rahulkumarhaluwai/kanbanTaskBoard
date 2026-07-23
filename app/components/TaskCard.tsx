"use client";

import { useState } from "react";
import EditTaskForm from "./EditTaskForm";
import DeleteTaskButton from "./DeleteTaskButton";
import UpdateTaskStatus from "./UpdateTaskStatus";

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

export default function TaskCard({
  task,
  users,
  isAdmin,
  onDragStart,
}: {
  task: Task;
  users: User[];
  isAdmin: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="mb-4 rounded-lg border p-4 shadow-sm"
    >
      {isEditing ? (
        <EditTaskForm
          task={task}
          users={users}
          isAdmin={isAdmin}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <>
          <h3 className="font-bold">{task.title}</h3>

          <p>{task.description}</p>

          <small>Assigned to: {task.assignedTo.name}</small>

          <div className="mt-3 flex gap-2">
            <UpdateTaskStatus taskId={task.id} currentStatus={task.status} />

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:shadow active:scale-95"
            >
              Edit
            </button>

            {isAdmin && <DeleteTaskButton taskId={task.id} />}
          </div>
        </>
      )}
    </div>
  );
}
