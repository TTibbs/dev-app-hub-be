import db from "../db/connection";

export const selectApps = async () => {
  const result = await db.query(`
    SELECT
        a.id,
        a.name,
        a.description,
        a.category,
        a.app_url,
        a.app_img_url,
        a.avg_rating::float8 AS avg_rating,
        a.developer_id,
        a.created_at,
        a.updated_at,
        COALESCE(array_remove(array_agg(DISTINCT i.id), NULL), '{}') AS issue_ids,
        COALESCE(array_remove(array_agg(DISTINCT c.id), NULL), '{}') AS comment_ids,
        COALESCE(array_remove(array_agg(DISTINCT r.id), NULL), '{}') AS rating_ids
    FROM apps a
    LEFT JOIN issues i ON i.app_id = a.id
    LEFT JOIN comments c ON c.app_id = a.id
    LEFT JOIN ratings r ON r.app_id = a.id
    GROUP BY a.id;
    `);
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "No apps found" });
  }
  return result.rows;
};

export const selectAppById = async (app_id: number) => {
  const result = await db.query(
    `
    SELECT 
      a.id, 
      a.name, 
      a.description,
      a.category,
      a.app_url, 
      a.app_img_url, 
      a.avg_rating::float8 AS avg_rating, 
      a.developer_id, 
      a.created_at, 
      a.updated_at,
      COALESCE(array_remove(array_agg(DISTINCT i.id), NULL), '{}') AS issue_ids,
      COALESCE(array_remove(array_agg(DISTINCT c.id), NULL), '{}') AS comment_ids,
      COALESCE(array_remove(array_agg(DISTINCT r.id), NULL), '{}') AS rating_ids
    FROM apps a
    LEFT JOIN issues i ON i.app_id = a.id
    LEFT JOIN comments c ON c.app_id = a.id
    LEFT JOIN ratings r ON r.app_id = a.id
    WHERE a.id = $1
    GROUP BY 
      a.id, 
      a.name, 
      a.description,
      a.category,
      a.app_url, 
      a.app_img_url, 
      a.avg_rating, 
      a.developer_id, 
      a.created_at, 
      a.updated_at;
    `,
    [app_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "App not found" });
  }
  return result.rows[0];
};

export const selectAppComments = async (app_id: number) => {
  // First check if the app exists
  const appCheck = await db.query("SELECT id FROM apps WHERE id = $1", [
    app_id,
  ]);

  if (appCheck.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "App not found" });
  }

  const result = await db.query(
    `
    SELECT 
      c.id,
      c.body,
      c.votes,
      c.author_id,
      c.created_at,
      c.updated_at,
      u.username as author_username
    FROM comments c
    JOIN users u ON c.author_id = u.id
    WHERE c.app_id = $1
    ORDER BY c.created_at DESC;
    `,
    [app_id]
  );

  // Return the comments array, which may be empty
  return result.rows;
};

export const insertApp = async (
  name: string,
  description: string,
  category: string,
  app_url: string,
  app_img_url: string,
  developer_id: number,
  avg_rating?: number
) => {
  const result = await db.query(
    `
    WITH inserted_app AS (
      INSERT INTO apps (name, description, category, app_url, app_img_url, developer_id, avg_rating)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    )
    SELECT 
      a.id, 
      a.name, 
      a.description, 
      a.category,
      a.app_url, 
      a.app_img_url, 
      a.avg_rating::float8 AS avg_rating, 
      a.developer_id, 
      a.created_at, 
      a.updated_at,
      COALESCE(array_remove(array_agg(DISTINCT i.id), NULL), '{}') AS issue_ids,
      COALESCE(array_remove(array_agg(DISTINCT c.id), NULL), '{}') AS comment_ids,
      COALESCE(array_remove(array_agg(DISTINCT r.id), NULL), '{}') AS rating_ids
    FROM inserted_app a
    LEFT JOIN issues i ON i.app_id = a.id
    LEFT JOIN comments c ON c.app_id = a.id
    LEFT JOIN ratings r ON r.app_id = a.id
    GROUP BY 
      a.id, 
      a.name, 
      a.description, 
      a.category,
      a.app_url, 
      a.app_img_url, 
      a.avg_rating, 
      a.developer_id, 
      a.created_at, 
      a.updated_at;
    `,
    [
      name,
      description,
      category,
      app_url,
      app_img_url,
      developer_id,
      avg_rating || null,
    ]
  );
  return result.rows[0];
};

export const updateAppById = async (
  app_id: number,
  name: string,
  description: string,
  category: string,
  app_url: string,
  app_img_url: string,
  developer_id: number,
  avg_rating: number
) => {
  const result = await db.query(
    `
    UPDATE apps
    SET name = $1, description = $2, category = $3, app_url = $4, app_img_url = $5, developer_id = $6, avg_rating = $7
    WHERE id = $8
    RETURNING *;
    `,
    [
      name,
      description,
      category,
      app_url,
      app_img_url,
      developer_id,
      avg_rating,
      app_id,
    ]
  );
  return result.rows[0];
};

export const deleteAppById = async (app_id: number) => {
  const result = await db.query(`DELETE FROM apps WHERE id = $1 RETURNING *`, [
    app_id,
  ]);
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "App not found" });
  }
  return result.rows[0];
};
