"use client";
import { useEffect, useState } from "react";

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetch("/api/conversations")
      .then(res => res.json())
      .then(data => setConversations(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      {conversations.length === 0 && <p>No conversations yet.</p>}
      <ul className="space-y-3">
        {conversations.map((chat: any) => (
          <li key={chat.id} className="border p-3 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{chat.name}</p>
              <p className="text-sm text-gray-500">{chat.email}</p>
            </div>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => window.location.href = `/chat?receiver=${chat.id}`}
            >
              Open Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
