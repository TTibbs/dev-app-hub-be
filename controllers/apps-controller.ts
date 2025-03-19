import { Request, Response, NextFunction } from "express";
import {
  selectApps,
  selectAppById,
  insertApp,
  updateAppById,
  deleteAppById,
  selectAppComments,
} from "../models/apps-model";
import db from "../db/connection";
import { selectUserById } from "../models/users-models";
import { App } from "../db/types";

export const getApps = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apps = await selectApps();
    res.status(200).send({ apps });
  } catch (error) {
    next(error);
  }
};

export const getAppById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { app_id } = req.params;
    if (isNaN(Number(app_id))) {
      return res.status(400).send({ msg: "Invalid app ID" });
    }
    const singleApp = await selectAppById(Number(app_id));
    res.status(200).send({ singleApp });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByAppId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { app_id } = req.params;
  if (isNaN(Number(app_id))) {
    return res.status(400).send({ msg: "Invalid app ID" });
  }
  try {
    const comments = await selectAppComments(Number(app_id));
    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};

export const createApp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    description,
    category,
    app_url,
    app_img_url,
    developer_id,
    avg_rating,
  } = req.body;
  try {
    if (
      !name ||
      !description ||
      !category ||
      !app_url ||
      !app_img_url ||
      !developer_id
    ) {
      return res.status(400).send({ msg: "Missing required fields" });
    }
    if (isNaN(Number(developer_id))) {
      return res.status(400).send({ msg: "Invalid developer_id" });
    }

    try {
      const developer = await selectUserById(Number(developer_id));
      if (developer.role !== "developer") {
        return res.status(403).send({
          msg: "Forbidden: Only users with developer role can create apps",
        });
      }
    } catch (error: any) {
      if (error.status === 404) {
        return res.status(404).send({ msg: "Developer not found" });
      }
      throw error;
    }

    const categoryResult = await db.query(
      "SELECT * FROM categories WHERE name = $1",
      [category]
    );
    if (categoryResult.rows.length === 0) {
      return res.status(400).send({ msg: "Category does not exist" });
    }

    const newApp = await insertApp(
      name,
      description,
      category,
      app_url,
      app_img_url,
      developer_id,
      avg_rating
    );
    res.status(201).send({ newApp });
  } catch (error) {
    next(error);
  }
};

export const updateApp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { app_id } = req.params;
  const {
    name,
    description,
    category,
    app_url,
    app_img_url,
    developer_id,
    avg_rating,
  } = req.body;
  try {
    if (isNaN(Number(app_id))) {
      return res.status(400).send({ msg: "Invalid app ID" });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ msg: "No fields to update" });
    }

    // First get the existing app to check ownership
    const existingApp = (await selectAppById(Number(app_id))) as App & {
      developer_id: number;
    };

    // If developer_id is provided in the request
    if (developer_id !== undefined) {
      if (isNaN(Number(developer_id))) {
        return res.status(400).send({ msg: "Invalid developer_id" });
      }

      // Check if the user exists and has role 'developer'
      try {
        const developer = await selectUserById(Number(developer_id));
        if (developer.role !== "developer") {
          return res.status(403).send({
            msg: "Forbidden: Only users with developer role can be assigned to apps",
          });
        }

        // If trying to reassign to a different developer
        if (existingApp.developer_id !== Number(developer_id)) {
          return res.status(403).send({
            msg: "Forbidden: This app does not belong to you.",
          });
        }
      } catch (error: any) {
        if (error.status === 404) {
          return res.status(404).send({ msg: "Developer not found" });
        }
        throw error;
      }
    }

    if (category) {
      const categoryResult = await db.query(
        "SELECT * FROM categories WHERE name = $1",
        [category]
      );
      if (categoryResult.rows.length === 0) {
        return res.status(400).send({ msg: "Category does not exist" });
      }
    }

    const updatedApp = await updateAppById(
      Number(app_id),
      name,
      description,
      category,
      app_url,
      app_img_url,
      Number(developer_id),
      avg_rating
    );
    res.status(200).send({ updatedApp });
  } catch (error) {
    next(error);
  }
};

export const deleteApp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { app_id } = req.params;
  const { developer_id } = req.body;

  try {
    if (isNaN(Number(app_id))) {
      return res.status(400).send({ msg: "Invalid app ID" });
    }

    // Check if the app exists before validating the developer_id
    try {
      const existingApp = (await selectAppById(Number(app_id))) as App & {
        developer_id: number;
      };

      if (developer_id === undefined) {
        return res.status(400).send({ msg: "Developer ID is required" });
      }

      if (isNaN(Number(developer_id))) {
        return res.status(400).send({ msg: "Invalid developer_id" });
      }

      if (existingApp.developer_id !== Number(developer_id)) {
        return res.status(403).send({
          msg: "Forbidden: You can only delete your own apps",
        });
      }

      await deleteAppById(Number(app_id));
      return res.status(200).send({ msg: "App deleted successfully" });
    } catch (error: any) {
      if (error.status === 404) {
        return res.status(404).send({ msg: "App not found" });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
