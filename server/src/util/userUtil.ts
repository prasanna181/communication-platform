import { Op } from "sequelize";
import User from "../database/models/user";

export const checkIfUserDoNotExists = async (payload) => {
  const { email, mobile } = payload;

  const conditions = [];

  if (email) {
    conditions.push({ email });
  }

  if (mobile) {
    conditions.push({ mobile });
  }

  if (conditions.length === 0) {
    return {
      success: false,
      error: "Email or mobile is required.",
    };
  }

  const user = await User.findOne({
    where: {
      [Op.or]: conditions,
    },
  });

  if (user)
    return {
      success: false,
      error: "User already exists.",
      data: user,
    };
  else {
    return {
      success: true,
    };
  }
};
