import sequelize from "./database/models/db";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import friendRoutes from "./routes/friendRoutes";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friends", friendRoutes);

const PORT = 8000;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {}
};

startServer();
