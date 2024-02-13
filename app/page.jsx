"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div>
      <div className=" flex gap-5 m-10">
        <input
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className=" text-black"
        />
        <button className=" bg-white  text-black rounded-md p-2" onClick={(e) => sendMessage(message)}>
          Send
        </button>
      </div>
      <div>
        {messages?.map((e) => (
          <li>{e}</li>
        ))}
      </div>
    </div>
  );
}
