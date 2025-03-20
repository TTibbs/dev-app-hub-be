import { Request, Response, NextFunction } from "express";
import { Comment } from "../db/types";
import {
  selectComments,
  selectCommentById,
  insertComment,
  updateCommentById,
  deleteCommentById,
} from "../models/comments-modal";

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await selectComments();
    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};

export const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { comment_id } = req.params;
  if (isNaN(Number(comment_id))) {
    return res.status(400).send({ msg: "Invalid comment ID" });
  }
  try {
    const comment = await selectCommentById(Number(comment_id));
    res.status(200).send({ comment });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body, votes, author_id, app_id, rating_id, issue_id } = req.body;

  // Check required fields
  if (!body || votes === undefined || !author_id) {
    return res
      .status(400)
      .send({ msg: "Missing required fields: body, votes, or author_id" });
  }

  // Check that exactly one target entity is specified
  const targetCount = [app_id, rating_id, issue_id].filter(
    (id) => id !== undefined && id !== null
  ).length;

  if (targetCount !== 1) {
    return res.status(400).send({
      msg: "A comment must be associated with exactly one of: app_id, rating_id, or issue_id",
    });
  }

  try {
    const comment = await insertComment(
      body,
      votes,
      author_id,
      app_id || null,
      rating_id || null,
      issue_id || null
    );
    res.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { comment_id } = req.params;
  const { body, votes, user_id } = req.body;

  if (!body || votes === undefined) {
    return res
      .status(400)
      .send({ msg: "Missing required fields: body, votes" });
  }

  if (!user_id) {
    return res.status(400).send({ msg: "Missing required field: user_id" });
  }

  if (isNaN(Number(comment_id))) {
    return res.status(400).send({ msg: "Invalid comment ID" });
  }

  try {
    // Get the comment first to check ownership
    const comment = (await selectCommentById(Number(comment_id))) as Comment;

    // Check if the user is the author of the comment
    if (comment.author_id !== Number(user_id)) {
      return res
        .status(403)
        .send({ msg: "Forbidden: You can only update your own comments" });
    }

    const updatedComment = await updateCommentById(Number(comment_id), {
      body,
      votes,
    });
    res.status(200).send({ comment: updatedComment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { comment_id } = req.params;
  const { user_id } = req.body;

  if (isNaN(Number(comment_id))) {
    return res.status(400).send({ msg: "Invalid comment ID" });
  }

  try {
    // Get the comment first to check ownership
    const comment = (await selectCommentById(Number(comment_id))) as Comment;

    // Check if the user is the author of the comment
    if (comment.author_id !== Number(user_id)) {
      return res
        .status(403)
        .send({ msg: "Forbidden: You can only delete your own comments" });
    }

    await deleteCommentById(Number(comment_id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
