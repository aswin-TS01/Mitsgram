"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch both user and faculty lists
        const [studentsRes, facultyRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/faculty-list"),
        ]);
        const students = await studentsRes.json();
        const faculty = await facultyRes.json();

        // Merge and tag each group
        const allUsers = [
          ...students.map((u: any) => ({ ...u, role: "Student" })),
          ...faculty.map((f: any) => ({ ...f, role: "Faculty" })),
        ];
        setUsers(allUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <input
        type="text"
        placeholder="Search users..."
        className="border p-2 w-full mb-4 rounded"
        onChange={(e) => {
          const q = e.target.value.toLowerCase();
          const cards = document.querySelectorAll(".user-card");
          cards.forEach((card: any) => {
            card.style.display = card.textContent.toLowerCase().includes(q)
              ? "block"
              : "none";
          });
        }}
      />

      <div className="grid gap-3">
        {users.map((user: any) => (
          <div key={user.id} className="user-card border p-3 rounded shadow bg-blue">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{user.name}</h2>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  user.role === "Faculty"
                    ? "bg-green-200 text-green-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {user.role}
              </span>
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm">
              {user.department} {user.batch ? `- ${user.batch}` : ""}
            </p>
            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() =>
                (window.location.href = `/chat?receiver=${user.id}`)
              }
            >
              Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
