import Conversation from "../database/models/conversation";
import Message, { MESSAGE_TYPE } from "../database/models/message";
import User from "../database/models/user";

export const sendMessageService = async ({
  senderId,
  conversationId,
  message,
}) => {
  const isConversationIdValid = await Conversation.findByPk(conversationId);

  if (!isConversationIdValid)
    return {
      success: false,
      statusCode: 404,
      error: "Conversation id is invalid.",
    };

  const user = await User.findByPk(senderId);

  const messageRecord = await Message.create({
    senderId,
    conversationId,
    message,
  });

  messageRecord.dataValues.user = user;

  return {
    success: true,
    statusCode: 200,
    data: messageRecord,
  };
};

export const sendFileMessageService = async ({
  senderId,
  conversationId,
  fileData,
}) => {
  const { fileUrl, originalName, mimeType, size } = fileData;

  const saved = await Message.create({
    senderId,
    conversationId,
    message: fileUrl,
    type: MESSAGE_TYPE.FILE,
    originalName: originalName,
    fileType: mimeType,
    fileSize: size,
  });

  return {
    success: true,
    data: saved,
  };
};
