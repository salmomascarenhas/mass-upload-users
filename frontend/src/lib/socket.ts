import { io, Socket } from "socket.io-client";

let socket: Socket;
export const apiURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function connectToSocket(flowId: string) {
  if (!socket || !socket.connected) {
    socket = io(`${apiURL}`, {
      path: "/socket.io",
      query: { flowId },
    });

    console.log("🔌 Conectando ao socket com flowId:", flowId);
  }

  return socket;
}
