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
import { apiCallWrapper } from "../util/apiResponse";
import { upload } from "../middlewares/upload";
import { sendFileMessage } from "../controllers/messageController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create_group_room",
  authMiddleware,
  validator.body(createRoomSchema),
  apiCallWrapper(createConversationRoom)
);
router.post(
  "/send",
  authMiddleware,
  validator.body(sendMessageSchema),
  apiCallWrapper(sendMessage)
);

router.post(
  "/send-file/:conversationId",
  authMiddleware,
  upload.single("file"),
  sendFileMessage
);

router.get(
  "/:conversationId",
  authMiddleware,
  apiCallWrapper(getMessageByRoomId)
);

export default router;
