"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold">
        Something went wrong
      </h1>

      <p className="mt-2 text-gray-500">
        An unexpected error occurred.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-md border px-4 py-2"
      >
        Try Again
      </button>
    </main>
  );
}