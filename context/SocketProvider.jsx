"use client"

import React, { useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState([]);

  const sendMessage = useCallback(
    (msg) => {
      console.log("Send Message", msg);
      if (socket) {
        socket.emit("event:message", { message: msg, from: socket.id });
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((message) => {
    console.log("From Server Msg Rec", message.message);
    console.log("From: ", message.from);

    const messageObject = {
      message: message.message,
      from: message.from
  };
    setMessages((prev) => [...prev, messageObject]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("event:message", onMessageRec);

    setSocket(_socket);

    return () => {
      _socket.off("event:message", onMessageRec);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, socket }}>
      {children}
    </SocketContext.Provider>
  );
};
