import db from "../db/connection";
import { User } from "../db/types";

export const selectUsers = async (): Promise<User[]> => {
  const result = await db.query("SELECT * FROM users");
  return result.rows as User[];
};
