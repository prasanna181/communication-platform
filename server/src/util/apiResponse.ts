import { NextFunction, Response, Request } from "express";

export const errorResponse = (
  res: Response,
  error: string | undefined,
  status = 422,
  code: string | null = null
) => res.status(status).json({ success: false, error, code });

export const successResponse = (
  res: Response,
  message: string,
  data: object = {},
  status = 200
) => res.status(status).json({ success: true, message, data });

export const apiCallWrapper = (asyncFunction: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncFunction(req, res, next).catch(next);
  };
};
