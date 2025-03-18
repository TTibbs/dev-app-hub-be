import app from "../app";
import request from "supertest";
import db from "../db/connection";
import seed from "../db/seeds/seed";
import * as testData from "../db/data/test-data";
import endpoints from "../endpoints.json";
import { User } from "../db/types";

beforeEach(() =>
  seed({
    users: testData.userData,
    apps: testData.appsData,
    ratings: testData.ratingsData,
    comments: testData.commentsData,
    issues: testData.issuesData,
  })
);

afterAll(async () => {
  await db.end();
});

describe("GET /", () => {
  test("responds with 200 status and a message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: "Welcome to the API!" });
  });
});

describe("GET /api", () => {
  test("GET /api responds with endpoints", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ endpoints });
  });
});

describe("GET /health", () => {
  test("responds with 200 status and health information", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("service");
    expect(response.body).toHaveProperty("database");
    expect(response.body).toHaveProperty("responseTime");
  });
});

describe("GET /api/users", () => {
  test("responds with 200 status and users", async () => {
    const {
      body: { users },
    } = await request(app).get("/api/users").expect(200);
    expect(users).toBeInstanceOf(Array);
    users.map((user: User) => {
      expect(user).toHaveProperty("id", expect.any(Number));
      expect(user).toHaveProperty("username", expect.any(String));
      expect(user).toHaveProperty("name", expect.any(String));
      expect(user).toHaveProperty("email", expect.any(String));
      expect(user).toHaveProperty("role", expect.any(String));

      if (user.avg_rating !== null && user.avg_rating !== undefined) {
        const numericRating = Number(user.avg_rating);
        expect(numericRating).toBeGreaterThanOrEqual(1);
        expect(numericRating).toBeLessThanOrEqual(5);
        expect(user.avg_rating).toMatch(/^\d\.\d{2}$/);
      }

      expect(user).toHaveProperty("created_at", expect.any(String));
      expect(user).toHaveProperty("updated_at", expect.any(String));
    });
  });

  describe("GET /api/users/:user_id", () => {
    test("responds with 200 status and user", async () => {
      const {
        body: { user },
      } = await request(app).get("/api/users/1").expect(200);
      expect(user).toBeInstanceOf(Object);
      expect(user).toHaveProperty("id", expect.any(Number));
      expect(user).toHaveProperty("username", expect.any(String));
      expect(user).toHaveProperty("name", expect.any(String));
      expect(user).toHaveProperty("email", expect.any(String));
      expect(user).toHaveProperty("role", expect.any(String));
      if (user.avg_rating !== null && user.avg_rating !== undefined) {
        const numericRating = Number(user.avg_rating);
        expect(numericRating).toBeGreaterThanOrEqual(1);
        expect(numericRating).toBeLessThanOrEqual(5);
        expect(user.avg_rating).toMatch(/^\d\.\d{2}$/);
      }
      expect(user).toHaveProperty("app_ids", expect.any(Array));
      expect(user).toHaveProperty("comment_ids", expect.any(Array));
      expect(user).toHaveProperty("created_at", expect.any(String));
      expect(user).toHaveProperty("updated_at", expect.any(String));
    });
    test("responds with 400 status and error message if user_id is not a number", async () => {
      const { body } = await request(app)
        .get("/api/users/not-a-number")
        .expect(400);
      expect(body.msg).toBe("Invalid user_id");
    });
    test("responds with 404 status and error message if user does not exist", async () => {
      const { body } = await request(app).get("/api/users/999").expect(404);
      expect(body.msg).toBe("User not found");
    });
  });
});

describe("POST /api/users", () => {
  test("responds with 201 status and user", async () => {
    const { body } = await request(app)
      .post("/api/users")
      .send({
        username: "testuser",
        name: "Test User",
        email: "testuser@example.com",
        password: "password",
        role: "user",
      })
      .expect(201);
    expect(body.user).toBeInstanceOf(Object);
    expect(body.user).toHaveProperty("id", expect.any(Number));
    expect(body.user).toHaveProperty("username", "testuser");
    expect(body.user).toHaveProperty("name", "Test User");
    expect(body.user).toHaveProperty("email", "testuser@example.com");
    expect(body.user).toHaveProperty("role", "user");
    expect(body.user).toHaveProperty("password", "password");
    expect(body.user).toHaveProperty("avg_rating", null);
    expect(body.user).toHaveProperty("created_at", expect.any(String));
    expect(body.user).toHaveProperty("updated_at", expect.any(String));
  });
  test("should create a new developer user", async () => {
    const {
      body: { user },
    } = await request(app)
      .post("/api/users")
      .send({
        username: "testuser",
        name: "Test User",
        email: "testuser@example.com",
        password: "password",
        role: "developer",
        avg_rating: 4.5,
      })
      .expect(201);
    expect(user).toBeInstanceOf(Object);
    expect(user).toHaveProperty("id", expect.any(Number));
    expect(user).toHaveProperty("username", "testuser");
    expect(user).toHaveProperty("name", "Test User");
    expect(user).toHaveProperty("email", "testuser@example.com");
    expect(user).toHaveProperty("role", "developer");
    if (user.avg_rating !== null && user.avg_rating !== undefined) {
      const numericRating = Number(user.avg_rating);
      expect(numericRating).toBeGreaterThanOrEqual(1);
      expect(numericRating).toBeLessThanOrEqual(5);
      expect(user.avg_rating).toMatch(/^\d\.\d{2}$/);
    }
    expect(user).toHaveProperty("created_at", expect.any(String));
    expect(user).toHaveProperty("updated_at", expect.any(String));
  });
  test("should return 400 status and error message if required fields are missing", async () => {
    const { body } = await request(app).post("/api/users").send({}).expect(400);
    expect(body.msg).toBe("Missing required fields");
  });
  test("should return 400 status and error message if password is missing", async () => {
    const { body } = await request(app)
      .post("/api/users")
      .send({
        username: "testuser",
        name: "Test User",
        email: "testuser@example.com",
        role: "user",
      })
      .expect(400);
    expect(body.msg).toBe("Missing required fields");
  });
  test("should return 400 status and error message if username is missing", async () => {
    const { body } = await request(app)
      .post("/api/users")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        role: "user",
        password: "password",
      })
      .expect(400);
    expect(body.msg).toBe("Missing required fields");
  });
  test("should return 400 status and error message if name is missing", async () => {
    const { body } = await request(app)
      .post("/api/users")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        role: "user",
        password: "password",
      })
      .expect(400);
    expect(body.msg).toBe("Missing required fields");
  });
  test("should return 400 status and error message if email is missing", async () => {
    const { body } = await request(app)
      .post("/api/users")
      .send({
        username: "testuser",
        name: "Test User",
        role: "user",
        password: "password",
      })
      .expect(400);
    expect(body.msg).toBe("Missing required fields");
  });
  test("should return 400 status and error message if role is missing", async () => {
    const { body } = await request(app)
      .post("/api/users")
      .send({
        username: "testuser",
        name: "Test User",
        email: "testuser@example.com",
        password: "password",
      })
      .expect(400);
    expect(body.msg).toBe("Missing required fields");
  });
});

describe("PATCH /api/users/:user_id", () => {
  test("responds with 200 status and updated user", async () => {
    const patchedUser = {
      username: "updateduser",
      name: "Updated User",
      email: "updateduser@example.com",
      role: "developer",
      password: "password",
      avg_rating: 4.5,
    };
    const {
      body: { updatedUser },
    } = await request(app).patch("/api/users/1").send(patchedUser).expect(200);
    expect(updatedUser).toHaveProperty("id", 1);
    expect(updatedUser).toHaveProperty("username", "updateduser");
    expect(updatedUser).toHaveProperty("name", "Updated User");
    expect(updatedUser).toHaveProperty("email", "updateduser@example.com");
    expect(updatedUser).toHaveProperty("role", "developer");
    expect(updatedUser).toHaveProperty("password", "password");
    if (
      updatedUser.avg_rating !== null &&
      updatedUser.avg_rating !== undefined
    ) {
      const numericRating = Number(updatedUser.avg_rating);
      expect(numericRating).toBeGreaterThanOrEqual(1);
      expect(numericRating).toBeLessThanOrEqual(5);
      expect(updatedUser.avg_rating).toMatch(/^\d\.\d{2}$/);
    }
    expect(updatedUser).toHaveProperty("created_at", expect.any(String));
    expect(updatedUser).toHaveProperty("updated_at", expect.any(String));
  });
  test("should allow partial updates (username only)", async () => {
    const {
      body: { user },
    } = await request(app).get("/api/users/1").expect(200);
    expect(user).toHaveProperty("username", "alice123");
    const patchedUser = {
      username: "updateduser",
    };
    const {
      body: { updatedUser },
    } = await request(app).patch("/api/users/1").send(patchedUser).expect(200);
    expect(updatedUser).toHaveProperty("username", "updateduser");
  });
  test("should allow partial updates (name only)", async () => {
    const {
      body: { user },
    } = await request(app).get("/api/users/1").expect(200);
    expect(user).toHaveProperty("name", "Alice");
    const patchedUser = {
      name: "Updated User",
    };
    const {
      body: { updatedUser },
    } = await request(app).patch("/api/users/1").send(patchedUser).expect(200);
    expect(updatedUser).toHaveProperty("name", "Updated User");
  });
  test("should allow partial updates (email only)", async () => {
    const {
      body: { user },
    } = await request(app).get("/api/users/1").expect(200);
    expect(user).toHaveProperty("email", "alice@example.com");
    const patchedUser = {
      email: "updateduser@example.com",
    };
    const {
      body: { updatedUser },
    } = await request(app).patch("/api/users/1").send(patchedUser).expect(200);
    expect(updatedUser).toHaveProperty("email", "updateduser@example.com");
  });
  test("should allow partial updates (role only)", async () => {
    const {
      body: { user },
    } = await request(app).get("/api/users/1").expect(200);
    expect(user).toHaveProperty("role", "developer");
    const patchedUser = {
      role: "user",
    };
    const {
      body: { updatedUser },
    } = await request(app).patch("/api/users/1").send(patchedUser).expect(200);
    expect(updatedUser).toHaveProperty("role", "user");
  });
  test("should allow partial updates (password only)", async () => {
    const {
      body: { user },
    } = await request(app).get("/api/users/1").expect(200);
    const patchedUser = {
      password: "newpassword",
    };
    const {
      body: { updatedUser },
    } = await request(app).patch("/api/users/1").send(patchedUser).expect(200);
    expect(updatedUser).toHaveProperty("id", 1);
    expect(updatedUser).toHaveProperty("username", user.username);
    expect(updatedUser).toHaveProperty("email", user.email);
  });
  test("should allow partial updates (avg_rating only)", async () => {
    const {
      body: { user },
    } = await request(app).get("/api/users/1").expect(200);
    if (user.avg_rating !== null && user.avg_rating !== undefined) {
      const numericRating = Number(user.avg_rating);
      expect(numericRating).toBeGreaterThanOrEqual(4);
      expect(numericRating).toBeLessThanOrEqual(5);
      expect(user.avg_rating).toMatch(/^\d\.\d{2}$/);
    }
    const patchedUser = {
      avg_rating: 2,
    };
    const {
      body: { updatedUser },
    } = await request(app).patch("/api/users/1").send(patchedUser).expect(200);
    if (
      updatedUser.avg_rating !== null &&
      updatedUser.avg_rating !== undefined
    ) {
      const numericRating = Number(updatedUser.avg_rating);
      expect(numericRating).toBeGreaterThanOrEqual(2);
      expect(numericRating).toBeLessThanOrEqual(3);
      expect(updatedUser.avg_rating).toMatch(/^\d\.\d{2}$/);
    }
  });
  test("should return 400 status and error message if no fields to update", async () => {
    const {
      body: { msg },
    } = await request(app).patch("/api/users/1").send({}).expect(400);
    expect(msg).toBe("No fields to update");
  });
  test("should return 400 status and error message if user_id is not a number", async () => {
    const {
      body: { msg },
    } = await request(app)
      .patch("/api/users/not-a-number")
      .send({ username: "updateduser" })
      .expect(400);
    expect(msg).toBe("Invalid user_id");
  });
  test("should return 404 status and error message if user does not exist", async () => {
    const {
      body: { msg },
    } = await request(app)
      .patch("/api/users/999")
      .send({ username: "updateduser" })
      .expect(404);
    expect(msg).toBe("User not found");
  });
});
