"use client";

import { io } from "socket.io-client";

// 🔥 FORCE NETWORK URL
const BACKEND = "http://192.168.0.132:5000";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(BACKEND, { autoConnect: false });
  }
  return socket;
}

export { BACKEND };