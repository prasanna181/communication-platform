import Joi from "joi";
import { FREINDSHIP_REQUEST_STATUS } from "../database/models/friendRequest";

export const updateFriendRequestSchema = Joi.object({
  status: Joi.string()
    .valid(
      FREINDSHIP_REQUEST_STATUS.APPROVED,
      FREINDSHIP_REQUEST_STATUS.REJECTED
    )
    .required(),
});
