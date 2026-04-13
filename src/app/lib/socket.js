"use client";

import { io } from "socket.io-client";

// ✅ Use env variable (Vercel) OR fallback to Railway
const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND ||
  "https://whatsapp-backend-production-308a.up.railway.app";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(BACKEND, {
      transports: ["websocket"],     // ✅ avoid polling issues
      withCredentials: true,         // ✅ for auth if needed
      autoConnect: false,            // ✅ controlled connection
    });
  }
  return socket;
}

export { BACKEND };