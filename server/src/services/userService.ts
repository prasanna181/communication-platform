import User, { USER_ROLES } from "../database/models/user";
import { generateAccessToken } from "../util/jwtUtil";
import { checkIfUserDoNotExists } from "../util/userUtil";

interface Response {
  success: boolean;
  error?: string;
  data?: object;
}

export const signupService = async (payload): Promise<Response> => {
  const { firstName, lastName, mobile, email, password, confirmPassword } =
    payload;

  const response = await checkIfUserDoNotExists({ email, mobile });

  if (!response.success) return response;

  if (password !== confirmPassword)
    return {
      success: false,
      error: "Password do not matched.",
    };

  const user = await User.create({
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    mobile,
    email,
    password_hash: password,
    role: USER_ROLES.USER,
  });

  const token = await generateAccessToken({
    mobile,
    email,
    role: user.role,
    id: user.id,
  });

  return {
    success: true,
    data: { user, token },
  };
};

export const loginService = async (payload): Promise<Response> => {
  const { mobile, email, password } = payload;

  const response = await checkIfUserDoNotExists({ email, mobile });

  if (response.success) {
    return {
      success: false,
      error: "User do not exists",
    };
  }

  if (!(await response.data.validatePassword(password))) {
    return {
      success: false,
      error: "Password do not matches.",
    };
  }

  const token = await generateAccessToken({
    mobile,
    email,
    role: response.data.role,
    id: response.data.id,
  });

  return {
    success: true,
    data: { user: response.data, token },
  };
};
