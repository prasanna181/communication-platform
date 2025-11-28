import FriendRequest from "../database/models/friendRequest";
import User from "../database/models/user";
import { successResponse } from "../util/apiResponse";

export const makeFriendRequest = async (req, res) => {
  const { id: userId } = req.user;
  const { friendId } = req.params;

  await FriendRequest.create({
    userId,
    friendId,
  });

  return successResponse(res, "Friendship request is made successfully.");
};

export const accetpOrRejectFriendship = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  await FriendRequest.update({ status }, { where: { id: requestId } });

  return successResponse(res, `Request has been successfully ${status}.`);
};

export const getFriendsList = async (req, res) => {
  const { id: userId } = req.user;

  const friends = await FriendRequest.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: User,
        as: "friends",
      },
    ],
  });

  return successResponse(
    res,
    "All friends list retrieved successfully.",
    friends
  );
};
