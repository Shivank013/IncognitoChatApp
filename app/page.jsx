"use client"

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Page() {
  const { sendMessage, messages, socket } = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div>
      <div className="flex gap-5 m-10">
        <input
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className="text-black"
        />
        <button
          className="bg-white text-black rounded-md p-2"
          onClick={(e) => sendMessage(message)}
        >
          Send
        </button>
      </div>
      <div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`py-1 px-2 rounded-xl flex w-40 ${
              msg.from === socket.id
                ? "self-end bg-green-500 text-white"
                : "self-start bg-blue-500 text-white"
            }`}
          >
            {msg.message} {/* Accessing the 'message' property of 'msg' */}
          </div>
        ))}
      </div>
    </div>
  );
}
