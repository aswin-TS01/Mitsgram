"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/users"); // ✅ redirect after login
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-2xl shadow-xl w-96 space-y-4 border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center text-teal-400">Login</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="bg-gray-700 text-white border border-gray-600 p-2 w-full rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="bg-gray-700 text-white border border-gray-600 p-2 w-full rounded"
        />

        {error && <p className="text-red-400 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-600 text-white w-full py-2 rounded font-semibold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <a href="/student-register" className="text-teal-400 hover:underline">
            Register
          </a>{" "}
          or{" "}
          <a href="/faculty-register" className="text-teal-400 hover:underline">
            Faculty Register
          </a>
        </p>
      </form>
    </div>
  );
}

