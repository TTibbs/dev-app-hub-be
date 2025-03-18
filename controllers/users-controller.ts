import { Request, Response, NextFunction } from "express";
import {
  selectUsers,
  selectUserById,
  insertUser,
  patchUser,
} from "../models/users-models";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    if (isNaN(Number(user_id))) {
      return res.status(400).send({ msg: "Invalid user_id" });
    }
    const user = await selectUserById(Number(user_id));
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, name, email, role, password, avg_rating } = req.body;
    if (!username || !name || !email || !role || !password) {
      return res.status(400).send({ msg: "Missing required fields" });
    }
    const user = await insertUser(
      username,
      name,
      email,
      role,
      password,
      avg_rating
    );
    res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;

    if (isNaN(Number(user_id))) {
      return res.status(400).send({ msg: "Invalid user_id" });
    }

    await selectUserById(Number(user_id));

    const { username, name, email, role, password, avg_rating } = req.body;

    // if (!username && !name && !email && !role && !password && !avg_rating) {
    //   return res.status(400).send({ msg: "No fields to update" });
    // }

    const updatedUser = await patchUser(
      Number(user_id),
      username,
      name,
      email,
      role,
      password,
      avg_rating
    );

    res.status(200).send({ updatedUser });
  } catch (err) {
    next(err);
  }
};
