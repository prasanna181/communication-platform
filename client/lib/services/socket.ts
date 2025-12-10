// lib/socket.ts
import { io } from "socket.io-client";
import { Utils } from "./storage";

const token = await Utils.getItem("authToken");

export const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  auth: { token }
});
