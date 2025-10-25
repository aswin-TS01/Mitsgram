"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FacultyRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const department = e.target.department.value;
    const designation = e.target.designation.value;

    const res = await fetch("/api/faculty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, department, designation }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Faculty registered successfully!");
      router.push("/login");
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-2xl shadow-xl w-96 space-y-4 border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center text-teal-400">
          Faculty Registration
        </h1>

        {/* same input styles */}
        <input name="name" type="text" placeholder="Name" required className="bg-gray-700 text-white border border-gray-600 p-2 w-full rounded" />
        <input name="email" type="email" placeholder="Email" required className="bg-gray-700 text-white border border-gray-600 p-2 w-full rounded" />
        <input name="password" type="password" placeholder="Password" required className="bg-gray-700 text-white border border-gray-600 p-2 w-full rounded" />
        <input name="department" type="text" placeholder="Department" required className="bg-gray-700 text-white border border-gray-600 p-2 w-full rounded" />
        <input name="designation" type="text" placeholder="Designation" required className="bg-gray-700 text-white border border-gray-600 p-2 w-full rounded" />

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-600 text-white w-full py-2 rounded font-semibold transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-teal-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>

  );
}
