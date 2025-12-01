import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET_KEY =
  process.env.ACCESS_TOKEN_SECRET_KEY || "ACCESS_SECRET_KEY";

// Token expiry durations
const ACCESS_EXPIRES_IN = "1d";

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  mobile?: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET_KEY) as JwtPayload;
  } catch (error) {
    return null;
  }
};
