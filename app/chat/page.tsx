"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ChatContent() {
  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiver");
  const [senderId, setSenderId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then(async (session) => {
        if (session?.user?.email) {
          const res = await fetch(`/api/getUserId?email=${session.user.email}`);
          const data = await res.json();
          setSenderId(data.id);
        }
      });
  }, []);

  useEffect(() => {
    if (!receiverId || !senderId) return;
    fetch(`/api/messages?sender=${senderId}&receiver=${receiverId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [receiverId, senderId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId, content: input }),
    });
    setInput("");
    fetch(`/api/messages?sender=${senderId}&receiver=${receiverId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-2xl max-w-xs ${msg.senderId === senderId
                ? "ml-auto bg-teal-600 text-white"
                : "mr-auto bg-gray-700 text-gray-200"
              }`}
          >
            <p>{msg.content}</p>
            <p className="text-xs text-gray-300 mt-1 text-right">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 flex border-t border-gray-700 bg-gray-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded bg-gray-700 text-white outline-none"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ✅ Wrap with Suspense to fix build error
export default function ChatPage() {
  return (
    <Suspense fallback={<div className="text-center p-10 text-gray-300">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
