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
  const [liveUsers, setLiveUsers] = useState(0);

  const sendMessage = useCallback(
    (msg) => {
      console.log("Send Message", msg);
      if (socket) {
        socket.emit("event:message", { message: msg, from: socket.id });
      }
    },
    [socket]
  );

  const getCurrentTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return `${hours}:${minutes}`;
  };

  const onMessageRec = useCallback((message) => {
    console.log("From Server Msg Rec", message.message);
    console.log("From: ", message.from);

    const messageObject = {
      message: message.message,
      from: message.from,
      time: getCurrentTime()
  };
    setMessages((prev) => [...prev, messageObject]);
  }, []);

  const handelUsers = useCallback((count) => {
    setLiveUsers(count);
  }, []);

  useEffect(() => {
    const _socket = io("https://chatappbackend-gp1d.onrender.com");
    _socket.on("event:message", onMessageRec);

    setSocket(_socket);

    _socket.on("liveUsers", handelUsers);

    return () => {
      _socket.off("event:message", onMessageRec);
      _socket.off("liveUsers", handelUsers);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, socket, liveUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
