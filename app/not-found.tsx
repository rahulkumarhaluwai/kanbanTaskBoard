import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold">404</h1>

      <p className="mt-2 text-gray-500">
        The page you're looking for doesn't exist.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 rounded-md border px-4 py-2"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}