import User, { USER_ROLES } from "../database/models/user";
import { loginService, signupService } from "../services/userService";
import { errorResponse, successResponse } from "../util/apiResponse";
import { generateAccessToken } from "../util/jwtUtil";

export const createOrLoginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const isAdminExist = await User.findOne({
    where: {
      role: USER_ROLES.ADMIN,
    },
  });

  let user, token;

  if (!isAdminExist) {
    user = await User.create({
      email,
      password_hash: password,
      role: USER_ROLES.ADMIN,
    });

    token = generateAccessToken({
      email,
      role: user.role,
      id: user.id,
    });
  } else {
    token = generateAccessToken({
      email,
      role: isAdminExist.role,
      id: isAdminExist.id,
    });
  }

  return successResponse(res, "Admin created or logged in successfully.", {
    user: isAdminExist || user,
    token,
  });
};

export const signup = async (req, res) => {
  const response = await signupService(req.body);

  if (!response.success) return errorResponse(res, response?.error, 403);

  return successResponse(res, "User registered successfully.", response?.data);
};

export const login = async (req, res) => {
  const response = await loginService(req.body);

  if (!response.success) return errorResponse(res, response?.error, 403);

  return successResponse(res, "User login successfully.", response?.data);
};

export const getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.perPage) || 10;

  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return successResponse(res, "All users retrieved successfully.", {
    total: count,
    page,
    perPage: limit,
    data: rows,
  });
};
