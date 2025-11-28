import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request } from "express";

import User, { USER_ROLES } from "../database/models/user";

dotenv.config();

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY as string;

export interface AuthRequest extends Request {
  user?: { id: number; email?: string; role: string };
}

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  console.log(token, "...........token");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    console.log(decoded, "./////////////decoded");
    console.log(JWT_SECRET, ".............jwt secrete");

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is admin
    if (user.role !== USER_ROLES.ADMIN) {
      return res
        .status(403)
        .json({ message: "Access Denied: You are not an admin" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
