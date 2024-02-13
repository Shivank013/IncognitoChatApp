"use client"

import { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { IoSend } from "react-icons/io5";

export default function Page() {
  const { sendMessage, messages, socket, liveUsers } = useSocket();
  const [message, setMessage] = useState("");
  const messageContainerRef = useRef(null);

  
  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className=" flex w-[100vw] h-[100vh] justify-center items-center">
    <div className=" w-[100%] sm:w-1/2 h-[100%] bg-gray-900">

          <div className=" bg-white p-2 sm:p-4 text-black text-lg sm:text-xl font-bold">Live Users: <span className=" text-red-400">{liveUsers}</span></div>
            
            <div className="flex flex-col w-[100%] h-[85%]">
                  <div
                    className="overflow-y-auto overflow-x-hidden gap-1 sm:gap-2 flex flex-col h-full m-1"
                    style={{ scrollbarWidth: 'none', 'msOverflowStyle': 'none' }}
                    ref={messageContainerRef}
                  >
                    {messages?.map((msg, index) => (
                      <div
                        key={index}
                        className={`py-1 sm:px-3 px-2 rounded-xl font-medium flex w-[full] ${msg.from === socket.id ? 'self-end bg-green-700 text-white' : 'self-start bg-gray-700 text-white'}`}
                      >
                      {
                        !(msg.from === socket.id) ?
                        <div><div className=" text-red-400 text-[5px] sm:text-[10px]">id:{msg.from} </div>{msg.message} <div className=" text-end text-[4px] sm:text-[8px] font-normal">{msg.time}</div></div> : 
                        <span>{msg.message} <div className=" text-end text-[4px] sm:text-[8px] font-normal">{msg.time}</div></span>
                      }
                      </div>
                    ))}
                  </div>
            </div>

            <div className="flex gap-4 sm:gap-4 w-full">
              <input
                placeholder='Message..'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="text-black font-semibold w-full rounded-2xl ml-2 sm:ml-4 py-1 sm:py-2 px-2 sm:px-3"
              />
              <button
                className=" bg-green-700 text-white font-bold rounded-full mr-2 sm:mr-4 py-1 sm:py-2 px-2 sm:px-3"
                onClick={(e) => handleSendMessage()}
              >
                <IoSend/>
              </button>
            </div>

    </div>
    </div>
  );
}
