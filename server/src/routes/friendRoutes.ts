import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  accetpOrRejectFriendship,
  getFriendsList,
  makeFriendRequest,
} from "../controllers/friendController";
import { updateFriendRequestSchema } from "../validation/friendValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/make_friend_request/:friendId",
  authMiddleware,
  makeFriendRequest
);
router.put(
  "/:requestId",
  authMiddleware,
  validator.body(updateFriendRequestSchema),
  accetpOrRejectFriendship
);
router.get("/my_friends", authMiddleware, getFriendsList);

export default router;
