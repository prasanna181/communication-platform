import Message, { MESSAGE_TYPE } from "../database/models/message";
import User from "../database/models/user";
import {
  sendFileMessageService,
  sendMessageService,
} from "../services/messageService";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    //---------------------------------------> JOIN ROOM
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);

      console.log(
        `conversation_${conversationId}`,
        "..................roomid when joining room"
      );
    });

    //----------------------------------------> SEND MESSAGE
    socket.on("send_message", async (data) => {
      const { senderId, conversationId, message, type } = data;

      try {
        let saved;
        if (type === MESSAGE_TYPE.TEXT) {
          const text = await sendMessageService({
            senderId: senderId,
            conversationId: conversationId,
            message: message,
          });

          console.log(text.data,".........................message received")

          saved = text.data;
        } else {
          const fileMsg = await Message.findOne({
            where: {
              senderId: senderId,
              conversationId: conversationId,
            },
            include: [
              {
                model: User,
                as: "user",
              },
            ],
            order: [["createdAt", "DESC"]],
          });

          saved= fileMsg.toJSON()
        }

        //--------------------------------------> broadcast to all users of this coversation id
        io.to(`conversation_${data.conversationId}`).emit("new_message", saved);

        console.log(
          `conversation_${data.conversationId}`,
          "..................roomid when broadcasting new messages to the room"
        );
      } catch (err) {
        console.error("Socket error:", err.message);
        socket.emit("send_message_error", { message: err.message });
      }
    });

    //---------------------------------------->started typing
    socket.on("typing", ({ conversationId, userId }) => {
      socket
        .to(`conversation_${conversationId}`)
        .emit("typing", { conversationId, userId });
    });

    // -------------------------------------> stopped typing

    socket.on("stop_typing", ({ conversationId, userId }) => {
      socket
        .to(`conversation_${conversationId}`)
        .emit("stop_typing", { conversationId, userId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
