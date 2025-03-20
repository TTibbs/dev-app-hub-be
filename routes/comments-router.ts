import { Router } from "express";
const commentsRouter = Router();
import {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comments-controller";

commentsRouter.get("/", getComments);
commentsRouter.get("/:comment_id", getCommentById);
commentsRouter.post("/", createComment);
commentsRouter.patch("/:comment_id", updateComment);
commentsRouter.delete("/:comment_id", deleteComment);

export default commentsRouter;
