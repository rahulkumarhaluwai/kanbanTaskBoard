"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
  assignedToId: string;
};

export default function EditTaskForm({
  task,
  users,
  isAdmin,
  onClose,
}: {
  task: Task;
  users: User[];
  isAdmin: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [assignedToId, setAssignedToId] = useState(task.assignedToId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    const response = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: task.id,
        title,
        description,
        assignedToId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      setIsSubmitting(false);
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Task Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add more details about this task..."
          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        />
      </div>
      {isAdmin && (
        <div className="space-y-2">
          <label
            htmlFor="assignee"
            className="block text-sm font-medium text-gray-700"
          >
            Assign To
          </label>

          <select
            id="assignee"
            value={assignedToId}
            onChange={(event) => setAssignedToId(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          >
            {users
              .filter((user) => user.role === "MEMBER")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
