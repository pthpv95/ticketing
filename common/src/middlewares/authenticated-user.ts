import { NextFunction, Request, Response } from "express"
import { UnauthorizedError } from "../errors/unauthorized-error"

export const authorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }

  return next()
}
