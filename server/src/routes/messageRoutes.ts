import express from "express";
import { createValidator } from "express-joi-validation";
import {
  createRoomSchema,
  sendMessageSchema,
} from "../validation/messageValidation";
import {
  createConversationRoom,
  getMessageByRoomId,
  sendMessage,
} from "../controllers/messageController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create_room",
  authMiddleware,
  validator.body(createRoomSchema),
  createConversationRoom
);
router.post(
  "/send",
  authMiddleware,
  validator.body(sendMessageSchema),
  sendMessage
);
router.get("/:conversationId", authMiddleware, getMessageByRoomId);

export default router;
