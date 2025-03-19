import format from "pg-format";
import db from "../connection";
import { User, App, Rating, Comment, Issue, Category } from "../types";

const seed = async (data: {
  users: User[];
  apps: App[];
  ratings: Rating[];
  comments: Comment[];
  issues: Issue[];
  categories: Category[];
}) => {
  try {
    await db.query("DROP TABLE IF EXISTS comments CASCADE;");
    await db.query("DROP TABLE IF EXISTS ratings CASCADE;");
    await db.query("DROP TABLE IF EXISTS issues CASCADE;");
    await db.query("DROP TABLE IF EXISTS apps CASCADE;");
    await db.query("DROP TABLE IF EXISTS categories CASCADE;");
    await db.query("DROP TABLE IF EXISTS users CASCADE;");

    await db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY UNIQUE,
        username VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(255) NOT NULL check (role in ('developer', 'user')),
        password VARCHAR(255) NOT NULL,
        avg_rating DECIMAL(3, 2),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY UNIQUE,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE apps (
        id SERIAL PRIMARY KEY UNIQUE,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        category VARCHAR(255) NOT NULL REFERENCES categories(name) ON DELETE CASCADE,
        app_url VARCHAR(255) NOT NULL,
        app_img_url VARCHAR(255) NOT NULL,
        avg_rating DECIMAL(3, 2) DEFAULT NULL,
        developer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE issues (
        id SERIAL PRIMARY KEY UNIQUE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(255) NOT NULL check (status in ('open', 'in progress', 'closed')),
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        app_id INTEGER NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE ratings (
        id SERIAL PRIMARY KEY UNIQUE,
        rating INTEGER NOT NULL check (rating >= 1 and rating <= 5),
        body TEXT NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        app_id INTEGER REFERENCES apps(id) ON DELETE CASCADE,
        developer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE comments (
        id SERIAL PRIMARY KEY UNIQUE,
        body TEXT NOT NULL,
        votes INTEGER NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        app_id INTEGER REFERENCES apps(id) ON DELETE CASCADE,
        rating_id INTEGER REFERENCES ratings(id) ON DELETE CASCADE,
        issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    const insertUsersQueryString = format(
      `INSERT INTO users (username, name, email, role, password, avg_rating, created_at, updated_at) VALUES %L`,
      data.users.map((user) => [
        user.username,
        user.name,
        user.email,
        user.role,
        user.password,
        user.avg_rating,
        user.created_at,
        user.updated_at,
      ])
    );
    await db.query(insertUsersQueryString);

    const insertCategoriesQueryString = format(
      `INSERT INTO categories (name, description, created_at, updated_at) VALUES %L`,
      data.categories.map((category) => [
        category.name,
        category.description,
        category.created_at,
        category.updated_at,
      ])
    );
    await db.query(insertCategoriesQueryString);

    const insertAppsQueryString = format(
      `INSERT INTO apps (name, description, category, app_url, app_img_url, avg_rating, developer_id, created_at, updated_at) VALUES %L`,
      data.apps.map((app) => [
        app.name,
        app.description,
        app.category,
        app.app_url,
        app.app_img_url,
        app.avg_rating,
        app.developer_id,
        app.created_at,
        app.updated_at,
      ])
    );
    await db.query(insertAppsQueryString);

    const insertIssuesQueryString = format(
      `INSERT INTO issues (title, description, status, author_id, app_id, created_at, updated_at) VALUES %L`,
      data.issues.map((issue) => [
        issue.title,
        issue.description,
        issue.status,
        issue.author_id,
        issue.app_id,
        issue.created_at,
        issue.updated_at,
      ])
    );
    await db.query(insertIssuesQueryString);

    const insertRatingsQueryString = format(
      `INSERT INTO ratings (rating, body, author_id, app_id, developer_id, created_at, updated_at) VALUES %L`,
      data.ratings.map((rating) => [
        rating.rating,
        rating.body,
        rating.author_id,
        rating.app_id,
        rating.developer_id,
        rating.created_at,
        rating.updated_at,
      ])
    );
    await db.query(insertRatingsQueryString);

    const insertCommentsQueryString = format(
      `INSERT INTO comments (body, votes, author_id, app_id, rating_id, issue_id, created_at, updated_at) VALUES %L`,
      data.comments.map((comment) => [
        comment.body,
        comment.votes,
        comment.author_id,
        comment.app_id,
        comment.rating_id,
        comment.issue_id,
        comment.created_at,
        comment.updated_at,
      ])
    );
    await db.query(insertCommentsQueryString);
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error seeding database:", err);
  }
};

export default seed;
