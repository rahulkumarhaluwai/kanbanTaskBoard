"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["TODO", "IN_PROGRESS", "DONE"];

export default function UpdateTaskStatus({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(newStatus: string) {
    setError("");
    setStatus(newStatus);
    setIsUpdating(true);

    const response = await fetch("/api/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: taskId,
        status: newStatus,
      }),
    });

    if (!response.ok) {
      const data = await response.json();

      setError(data.error || "Failed to update task");
      setStatus(currentStatus);
      setIsUpdating(false);

      return;
    }

    setIsUpdating(false);
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={(event) => handleChange(event.target.value)}
      disabled={isUpdating}
    >
      {error && <p className="text-sm text-red-500">{error}</p>}
      {statuses.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
