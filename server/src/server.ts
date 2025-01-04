import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { console } from "inspector";
import { verifyToken } from "./lib/auth/jwt";
import { ConnectedUser } from "./lib/types";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./lib/mongodb/mongodb";
import Message from "./lib/mongodb/models/Message";
import User from "./lib/mongodb/models/User";
import sessionRouter from "./api/auth/session";
import usersRouter from "./api/users";
import messagesRouter from "./api/chat/messages";

const app = express();
app.use(cookieParser());
await connectToDatabase();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use("/api/auth", sessionRouter);
app.use("/api/users", usersRouter);
app.use("/api/chat", messagesRouter);

io.use(async (socket, next) => {
  const handshake = socket.handshake; // HTTP handshake object
  // Parse cookies using cookie-parser logic
  const cookies = Object.fromEntries(
    handshake.headers.cookie
      ? handshake.headers.cookie.split("; ").map((cookie) => cookie.split("="))
      : []
  );

  const accessToken = cookies["accessToken"];
  const refreshToken = cookies["refreshToken"];
  const verifyData = await verifyToken(accessToken, refreshToken);
  const user = verifyData.payload;
  if (!user) {
    return next(new Error("Unauthorized: No access token"));
  }
  socket.data.user = user;
  next();
});

const connectedUsers = new Map<string, ConnectedUser>();
const fetchUsers = async () => {
  const users = await User.find();
  users.forEach((user) => {
    connectedUsers.set(user.id, {
      status: "offline",
      userId: user.id,
      username: user.username,
      profileUrl: user.profileUrl,
    });
  });
};
await fetchUsers();

io.on("connection", (socket) => {
  console.log("Connected:", socket.data.user);
  const user = socket.data.user;
  connectedUsers.set(socket.data.user.id, {
    status: "online",
    userId: user.id,
    username: user.username,
    profileUrl: user.profileUrl,
  });
  io.emit("connected-users", Array.from(connectedUsers.values()));
  socket.on("send-message", async (data) => {
    const message = data.text;
    const messageDoc = await Message.create({
      message,
      userId: user.id,
      createdAt: new Date(),
      type: "text",
    });

    const userDetails = await User.findById(user.id);
    if (userDetails && messageDoc) {
      userDetails.set("password", undefined);
      userDetails.set("email", undefined);
      messageDoc.set("userId", undefined);
    }
    const newMessage = {
      ...messageDoc.toJSON(),
      user: userDetails,
    };

    io.emit("new-message", newMessage);
  });

  socket.on("disconnect", () => {
    connectedUsers.set(socket.data.user.id, {
      status: "offline",
      userId: user.id,
      username: user.username,
      profileUrl: user.profileUrl,
    });
    io.emit("connected-users", Array.from(connectedUsers.values()));
    console.log("Disconnected:", { user });
  });
});

const PORT = 5000;
httpServer
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        "Port 5000 is already in use. Please use a different port."
      );
      process.exit(1);
    }
  });
