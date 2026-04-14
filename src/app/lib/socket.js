"use client";

import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
}

export { SOCKET_URL as BACKEND };