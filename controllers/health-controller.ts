import { Request, Response, NextFunction } from "express";

export const getHealthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).send({ message: "Server is running" });
  } catch (err) {
    next(err);
  }
};
