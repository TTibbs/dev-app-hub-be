import db from "../db/connection";

export const selectComments = async () => {
  const result = await db.query("SELECT * FROM comments");
  return result.rows;
};

export const selectCommentById = async (comment_id: number) => {
  const result = await db.query(
    `SELECT * FROM comments WHERE comments.id = $1`,
    [comment_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
  return result.rows[0];
};

export const insertComment = async (
  body: string,
  votes: number,
  author_id: number,
  app_id: number,
  rating_id: number | null,
  issue_id: number | null
) => {
  const result = await db.query(
    `INSERT INTO comments (body, votes, author_id, app_id, rating_id, issue_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [body, votes, author_id, app_id, rating_id, issue_id]
  );
  return result.rows[0];
};

export const updateCommentById = async (
  comment_id: number,
  { body, votes }: { body: string; votes: number }
) => {
  const result = await db.query(
    `UPDATE comments SET body = $1, votes = $2 WHERE id = $3 RETURNING *`,
    [body, votes, comment_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
  return result.rows[0];
};

export const deleteCommentById = async (comment_id: number) => {
  const result = await db.query(
    `DELETE FROM comments WHERE id = $1 RETURNING *`,
    [comment_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
  return result.rows[0];
};
