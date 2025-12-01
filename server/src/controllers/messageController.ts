import { Op } from "sequelize";
import Message from "../database/models/message";
import Conversation, {
  CONVERSATION_TYPE,
} from "../database/models/conversation";
import ConversationMember from "../database/models/conversationMember";
import { errorResponse, successResponse } from "../util/apiResponse";
import User from "../database/models/user";

export const createConversationRoom = async (req, res) => {
  const senderId = req.user.id;
  const { memberIds = [], name } = req.body;

  let conversation;

  conversation = await Conversation.create({
    type: CONVERSATION_TYPE.GROUP,
    name: name || "New Group",
  });

  if (!memberIds.includes(senderId)) {
    memberIds.push(senderId);
  }

  const memberRows = memberIds.map((userId) => ({
    conversationId: conversation.id,
    userId,
  }));

  await ConversationMember.bulkCreate(memberRows);

  return successResponse(res, "Conversation Room is created successfully.", {
    conversationId: conversation.id,
  });
};

export const sendMessage = async (req, res) => {
  const { message, conversationId } = req.body;
  const { id: senderId } = req.user;

  const isConversationIdValid = await Conversation.findByPk(conversationId);

  if (!isConversationIdValid)
    return errorResponse(res, "Conversation id is invalid.", 404);

  const messageRecord = await Message.create({
    senderId,
    conversationId,
    message,
  });

  return successResponse(res, "Message sent successfully.", messageRecord);
};

export const getMessageByRoomId = async (req, res) => {
  const { conversationId } = req.params;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.perPage) || 10;

  const offset = (page - 1) * limit;

  const members = await ConversationMember.findAll({
    where: {
      conversationId,
    },
  });

  const memberIds = members.map((member) => {
    return member.userId;
  });

  const { count, rows } = await Message.findAndCountAll({
    where: {
      senderId: {
        [Op.in]: memberIds,
      },
      conversationId,
    },

    include: [
      {
        model: User,
        as: "user",
      },
    ],

    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return successResponse(res, "All messages retrieved successfully.", {
    total: count,
    page,
    perPage: limit,
    messages: rows,
  });
};
