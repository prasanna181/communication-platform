import Joi from "joi";
import { CONVERSATION_TYPE } from "../database/models/conversation";

export const createRoomSchema = Joi.object({
  memberIds: Joi.when("conversationType", {
    is: CONVERSATION_TYPE.GROUP,
    then: Joi.array().items(Joi.number().integer()).min(1).required(),
    otherwise: Joi.forbidden(),
  }),

  name: Joi.when("conversationType", {
    is: CONVERSATION_TYPE.GROUP,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
});

export const sendMessageSchema = Joi.object({
  conversationId: Joi.number().integer().required(),
  message: Joi.string().required(),
});
