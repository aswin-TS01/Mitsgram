"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const filteredUsers = users.filter((user: any) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    await signOut({ redirect: false }); // prevent NextAuth from handling redirect
    window.location.href = "/login";    // force full reload to login page
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-gray-900/70 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-teal-400 tracking-wide">
          MitsGram 💬
        </h1>

        <div className="flex items-center gap-4">
          {session?.user?.name && (
            <span className="text-gray-300 text-sm">
              Welcome,&nbsp;
              <span className="text-teal-400 font-medium">
                {session.user.name.split(" ")[0]}
              </span>
              👋
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Search bar */}
      <div className="p-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Users grid (unchanged below this point) */}
      <div className="grid gap-5 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user: any) => (
            <div
              key={user.id}
              className="user-card bg-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-teal-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-xl font-semibold text-white">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-teal-300">
                    {user.name}
                  </h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              {/* Role Tag */}
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${user.role === "Faculty"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                    : "bg-teal-500/20 text-teal-400 border border-teal-500/40"
                  }`}
              >
                {user.role}
              </span>

              <p className="text-sm text-gray-300 mb-4">
                {user.department} {user.batch && `- ${user.batch}`}
              </p>

              <button
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white font-semibold transition"
                onClick={() =>
                  (window.location.href = `/chat?receiver=${user.id}`)
                }
              >
                Chat
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No users found.</p>
        )}
      </div>
    </div>
  );
}

