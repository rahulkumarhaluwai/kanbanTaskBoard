"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteTaskButton({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    setIsDeleting(true);

    const response = await fetch(`/api/tasks?id=${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      console.error(data.error);
      setIsDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
