import { NextFunction, Request, Response } from "express";
import { errorResponse } from "./apiResponse";
interface MongoError extends Error {
  code?: number;
  errmsg?: string;
  keyValue?: Record<string, any>;
}
// Explicitly typing globalErrorHandler as an Express error-handling middleware
export const globalErrorHandler: (
  error: MongoError,
  req: Request,
  res: Response,
  next: NextFunction
) => void = (error, req, res, next) => {
  console.error(error.message);
  if (error.code === 11000) {
    const message = handleDuplicateKeyError(error);
    return errorResponse(res, message, 422, "duplicate_key_error");
  }
  errorResponse(res, error.message, 500, "internal_server_error");
};
const handleDuplicateKeyError = (error: any) => {
  const keyPattern = error.keyPattern || {};
  const fields = Object.keys(keyPattern);
  if (fields.length > 1) {
    const combinedFieldNames = fields.join(" , ");
    return `The combination of fields '${combinedFieldNames}' is already taken. Please use different values.`;
  } else {
    return `The field '${fields[0]}' is already taken. Please use a different value.`;
  }
};
