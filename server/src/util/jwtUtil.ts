import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET || "ACCESS_SECRET_KEY";

// Token expiry durations
const ACCESS_EXPIRES_IN = "1d";

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  mobile?: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};
