import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  accetpOrRejectFriendship,
  getAllFriendRequests,
  getFriendsList,
  getUserChatList,
  makeFriendRequest,
} from "../controllers/friendController";
import { updateFriendRequestSchema } from "../validation/friendValidation";
import { apiCallWrapper } from "../util/apiResponse";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/make_friend_request/:friendId",
  authMiddleware,
  apiCallWrapper(makeFriendRequest)
);

router.get(
  "/my_friend_requests",
  authMiddleware,
  apiCallWrapper(getAllFriendRequests)
);

router.put(
  "/:requestId",
  authMiddleware,
  validator.body(updateFriendRequestSchema),
  apiCallWrapper(accetpOrRejectFriendship)
);
router.get("/my_friends", authMiddleware, apiCallWrapper(getFriendsList));

router.get("/chat_lists", authMiddleware, apiCallWrapper(getUserChatList));

export default router;
