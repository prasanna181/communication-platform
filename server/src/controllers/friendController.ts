import { Op } from "sequelize";
import FriendRequest, {
  FREINDSHIP_REQUEST_STATUS,
} from "../database/models/friendRequest";
import User from "../database/models/user";
import { errorResponse, successResponse } from "../util/apiResponse";
import ConversationMember from "../database/models/conversationMember";
import Conversation, {
  CONVERSATION_TYPE,
} from "../database/models/conversation";

export const makeFriendRequest = async (req, res) => {
  const { id: userId } = req.user;
  const { friendId } = req.params;

  const isRequestAlreadyExist = await FriendRequest.findOne({
    where: {
      userId,
      friendId,
    },
  });

  if (isRequestAlreadyExist)
    return errorResponse(
      res,
      "Friendship Request is already made , wait for the other user to respond."
    );

  await FriendRequest.create({
    userId,
    friendId,
  });

  return successResponse(res, "Friendship request is made successfully.");
};

export const getAllFriendRequests = async (req, res) => {
  const { id: userId } = req.user;

  const requestMadeToUser = await FriendRequest.findAll({
    where: {
      friendId: userId,
      userId: { [Op.ne]: userId },
      status: FREINDSHIP_REQUEST_STATUS.PENDING,
    },
  });

  const requestMadeByUser = await FriendRequest.findAll({
    where: {
      userId,
      friendId: { [Op.ne]: userId },
      status: FREINDSHIP_REQUEST_STATUS.PENDING,
    },
  });

  return successResponse(
    res,
    "All Pending friendship requests made by or made to user are retrieved successfully.",
    { requestMadeByUser, requestMadeToUser }
  );
};

export const accetpOrRejectFriendship = async (req, res) => {
  const { requestId } = req.params;
  const { id: userId } = req.user;
  const { status } = req.body;

  const isValidRequest = await FriendRequest.findOne({
    where: {
      id: requestId,
      friendId: userId,
    },
  });


  if (!isValidRequest)
    return errorResponse(
      res,
      "Invalid request id or not authorized to accept/reject this friend request.",
      403
    );

  if (
    isValidRequest.status === FREINDSHIP_REQUEST_STATUS.APPROVED ||
    isValidRequest.status === FREINDSHIP_REQUEST_STATUS.REJECTED
  )
    return errorResponse(res, `Request is already ${isValidRequest.status}.`);

  await FriendRequest.update({ status }, { where: { id: requestId } });

  const conversation = await Conversation.create({
    type: CONVERSATION_TYPE.SINGLE,
  });

  await ConversationMember.bulkCreate([
    { conversationId: conversation.id, userId: isValidRequest.userId },
    { conversationId: conversation.id, userId: isValidRequest.friendId },
  ]);

  return successResponse(res, `Request has been successfully ${status}.`);
};

export const getFriendsList = async (req, res) => {
  const { id: userId } = req.user;

  const friends = await FriendRequest.findAll({
    where: {
      [Op.or]: [
        { userId: userId }, // my requests approved
        { friendId: userId }, // their requests approved
      ],
      status: FREINDSHIP_REQUEST_STATUS.APPROVED,
    },
    include: [
      {
        model: User,
        as: "friend",
      },
    ],
  });

  return successResponse(
    res,
    "All friends list retrieved successfully.",
    friends
  );
};

export const getUserChatList = async (req, res) => {
  const { id: userId } = req.user;

 const myConversations = await ConversationMember.findAll({
   where: { userId },
   attributes: ["conversationId"],
 });

 const conversationIds = myConversations.map((m) => m.conversationId);

const chatList = await Conversation.findAll({
  where: { id: { [Op.in]: conversationIds } },
  include: [
    {
      model: ConversationMember,
      as: "members",
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    },
  ],
});



  return successResponse(res, "All user chat list retrieved successfully.", {chatList})
};
