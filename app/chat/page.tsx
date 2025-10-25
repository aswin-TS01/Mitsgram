"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ChatPage() {
  const params = useSearchParams();
  const receiverId = params.get("receiver");
  const { data: session } = useSession(); // 🔑 Get logged-in user
  const [senderId, setSenderId] = useState("");
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  // Fetch the logged-in user's ID from DB using email
  useEffect(() => {
    const fetchSenderId = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/getUserId?email=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          console.log("✅ Logged-in user ID:", data.id);
          setSenderId(data.id);
        } else {
          console.error("Failed to fetch sender ID");
        }
      } catch (err) {
        console.error("Error fetching sender ID:", err);
      }
    };

    fetchSenderId();
  }, [session]);


  // Load existing messages between sender & receiver
  useEffect(() => {
    if (!receiverId || !senderId) return;
    fetch(`/api/messages?sender=${senderId}&receiver=${receiverId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [receiverId, senderId]);

  async function sendMessage() {
    if (!content.trim()) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId, content }),
    });
    const newMessage = await res.json();
    setMessages([...messages, newMessage]);
    setContent("");
  }

  return (
    <div className="flex flex-col h-screen p-6">
      <h1 className="text-2xl font-bold mb-3">Chat</h1>
      <div className="flex-1 border rounded p-3 overflow-y-auto mb-4 bg-gray-50">
        {messages.map((m: any) => {
          const createdAtRaw = m.createdAt;
          const createdAtDate = createdAtRaw ? new Date(createdAtRaw) : null;
          const timeString =
            createdAtDate && !isNaN(createdAtDate.getTime())
              ? createdAtDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "";

          const isSender = m.senderId === senderId;

          return (
            <div
              key={m.id ?? `${m.senderId}-${m.receiverId}-${Math.random()}`}
              className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 my-1 rounded-2xl max-w-[70%] shadow-md ${isSender
                    ? "bg-teal-500 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-100 rounded-bl-none"
                  }`}
              >
                <p className="break-words text-base">{m.content}</p>
                {timeString && (
                  <span className="text-xs text-gray-300 block mt-1 text-right">
                    {timeString}
                  </span>
                )}
              </div>
            </div>
          );
        })}



      </div>
      <div className="flex">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border p-2 rounded-l"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
