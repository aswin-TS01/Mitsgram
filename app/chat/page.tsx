"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ChatPage() {
  const { data: session } = useSession();
  const params = useSearchParams();
  const receiverId = params.get("receiver");

  const [senderId, setSenderId] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 🧩 Fetch current user id
  // in app/chat/page.tsx (inside useEffect that fetches senderId)
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchSenderId = async () => {
      try {
        const res = await fetch(`/api/getUserId?email=${session.user.email}`);
        const data = await res.json();
        console.log("getUserId response:", data); // debug
        const id = data.userId ?? data.id ?? data?.user?.id;
        if (id) {
          setSenderId(id);
          console.log("✅ senderId set to:", id);
        } else {
          console.error("❌ getUserId did not return an id");
        }
      } catch (err) {
        console.error("Error fetching sender ID:", err);
      }
    };

    fetchSenderId();
  }, [session]);


  // 🧩 Fetch messages
  useEffect(() => {
    if (!receiverId || !senderId) return;
    fetch(`/api/messages?sender=${senderId}&receiver=${receiverId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, [receiverId, senderId]);

  // 🧩 Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🧩 Send message
  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId, content }),
    });

    if (res.ok) {
      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setContent("");
    }
  };

  // 🧩 Format date + time
  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-gray-100">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-teal-400">MitsGram Chat 💬</h1>
        <button
          onClick={() => (window.location.href = "/users")}
          className="text-sm text-gray-400 hover:text-teal-400 transition"
        >
          ← Back to Users
        </button>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.senderId === senderId ? "items-end" : "items-start"
              }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow ${msg.senderId === senderId
                  ? "bg-teal-500 text-white rounded-br-none"
                  : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {msg.createdAt ? formatDateTime(msg.createdAt) : ""}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={sendMessage}
        className="p-4 bg-gray-900 border-t border-gray-700 flex items-center gap-3"
      >
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 bg-gray-800 text-gray-100 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
