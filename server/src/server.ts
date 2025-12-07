import sequelize from "./database/models/db";
import express from "express";
import cors from "cors";
import http from "http";

import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import friendRoutes from "./routes/friendRoutes";
import { Server } from "socket.io";
import { socketHandler } from "./sockets/socketHandler";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friends", friendRoutes);

const PORT = 8000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketHandler(io);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {}
};

startServer();
