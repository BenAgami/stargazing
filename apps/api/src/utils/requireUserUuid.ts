import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requireUserUuid = (
  req: Request<any, any, any, any>,
  res: Response,
): string | null => {
  const userUuid = req.user?.sub;
  if (!userUuid) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized access - user UUID is missing",
    });
    return null;
  }
  return userUuid;
};

export default requireUserUuid;
