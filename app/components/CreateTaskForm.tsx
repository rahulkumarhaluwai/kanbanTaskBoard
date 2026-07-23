"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTaskForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<
    {
      id: string;
      name: string;
      email: string;
      role: string;
    }[]
  >([]);
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("/api/users");
      const data = await response.json();

      setUsers(data);
    }

    fetchUsers();
  }, []);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setError("");
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title");
    const description = formData.get("description");
    const assignedToId = formData.get("assignedToId");

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        assignedToId,
      }),
    });

    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error || "Failed to create task");
      setIsSubmitting(false);
      return;
    }

    form.reset();
    router.refresh();

    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-lg border p-4">
      <h2 className="mb-4 text-xl font-bold">Create New Task</h2>
      <input
        name="title"
        placeholder="Task title"
        required
        className="mb-3 w-full rounded-md border p-2"
      />

      <textarea
        name="description"
        placeholder="Task description"
        className="mb-3 w-full rounded-md border p-2"
      />

      <select
        name="assignedToId"
        required
        className="mb-3 w-full rounded-md border p-2"
      >
        {users
          .filter((user) => user.role === "MEMBER")
          .map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "+ Create Task"}
      </button>
    </form>
  );
}
