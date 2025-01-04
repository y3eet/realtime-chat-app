import { SERVER_URL } from "../url";
import { io } from "socket.io-client";

export const socket = io(SERVER_URL, {
  withCredentials: true,
});
