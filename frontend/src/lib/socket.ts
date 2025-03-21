import { io, Socket } from "socket.io-client";

let socket: Socket;

export function connectToSocket(flowId: string) {
  if (!socket || !socket.connected) {
    socket = io("http://localhost:3000", {
      path: "/socket.io",
      query: { flowId },
    });

    console.log("🔌 Conectando ao socket com flowId:", flowId);
  }

  return socket;
}
