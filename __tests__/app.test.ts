import app from "../app";
import request from "supertest";
import db from "../db/connection";
import seed from "../db/seeds/seed";
import * as testData from "../db/data/test-data";
import endpoints from "../endpoints.json";
import { App, User } from "../db/types";

beforeEach(() =>
  seed({
    users: testData.userData,
    apps: testData.appsData,
    ratings: testData.ratingsData,
    comments: testData.commentsData,
    issues: testData.issuesData,
    categories: testData.categoriesData,
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

describe("GET ENDPOINTS", () => {
  describe("GET /api/users", () => {
    test("responds with 200 status and users", async () => {
      const {
        body: { users },
      } = await request(app).get("/api/users").expect(200);
      users.forEach((user: User) => {
        expect(user).toHaveProperty("id", expect.any(Number));
        expect(user).toHaveProperty("username", expect.any(String));
        expect(user).toHaveProperty("name", expect.any(String));
        expect(user).toHaveProperty("email", expect.any(String));
        expect(user).toHaveProperty("role", expect.any(String));
        if (user.role === "developer") {
          expect(user.avg_rating).toEqual(expect.any(Number));
        } else {
          if (user.avg_rating !== null) {
            expect(user.avg_rating).toEqual(expect.any(Number));
          } else {
            expect(user.avg_rating).toBeNull();
          }
        }
        expect(user).toHaveProperty("created_at", expect.any(String));
        expect(user).toHaveProperty("updated_at", expect.any(String));
        expect(user).toHaveProperty("issue_ids", expect.any(Array));
        expect(user).toHaveProperty("rating_ids", expect.any(Array));
        expect(user).toHaveProperty("comment_ids", expect.any(Array));
      });
    });

    describe("GET /api/users/:user_id", () => {
      test("responds with 200 status and user", async () => {
        const {
          body: { user },
        } = await request(app).get("/api/users/1").expect(200);
        expect(user).toHaveProperty("id", expect.any(Number));
        expect(user).toHaveProperty("username", expect.any(String));
        expect(user).toHaveProperty("name", expect.any(String));
        expect(user).toHaveProperty("email", expect.any(String));
        expect(user).toHaveProperty("role", expect.any(String));
        if (user.role === "developer") {
          expect(user.avg_rating).toEqual(expect.any(Number));
        } else {
          if (user.avg_rating !== null) {
            expect(user.avg_rating).toEqual(expect.any(Number));
          } else {
            expect(user.avg_rating).toBeNull();
          }
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

  describe("GET /api/apps", () => {
    test("responds with 200 status and apps", async () => {
      const {
        body: { apps },
      } = await request(app).get("/api/apps").expect(200);
      apps.map((app: App) => {
        expect(app).toHaveProperty("id", expect.any(Number));
        expect(app).toHaveProperty("name", expect.any(String));
        expect(app).toHaveProperty("description", expect.any(String));
        expect(app).toHaveProperty("category", expect.any(String));
        expect(app).toHaveProperty("app_url", expect.any(String));
        expect(app).toHaveProperty("app_img_url", expect.any(String));
        if (app.avg_rating !== null && app.avg_rating !== undefined) {
          const numericRating = Number(app.avg_rating);
          expect(numericRating).toBeGreaterThanOrEqual(1);
          expect(numericRating).toBeLessThanOrEqual(5);
          expect(app.avg_rating).toEqual(expect.any(Number));
        }
        expect(app).toHaveProperty("developer_id", expect.any(Number));
        expect(app).toHaveProperty("created_at", expect.any(String));
        expect(app).toHaveProperty("updated_at", expect.any(String));
        expect(app).toHaveProperty("issue_ids", expect.any(Array));
        expect(app).toHaveProperty("comment_ids", expect.any(Array));
        expect(app).toHaveProperty("rating_ids", expect.any(Array));
      });
    });

    describe("GET /api/apps/:app_id", () => {
      test("responds with 200 status and app", async () => {
        const {
          body: { singleApp },
        } = await request(app).get("/api/apps/1").expect(200);
        expect(singleApp).toHaveProperty("id", expect.any(Number));
        expect(singleApp).toHaveProperty("name", expect.any(String));
        expect(singleApp).toHaveProperty("description", expect.any(String));
        expect(singleApp).toHaveProperty("category", expect.any(String));
        expect(singleApp).toHaveProperty("app_url", expect.any(String));
        expect(singleApp).toHaveProperty("app_img_url", expect.any(String));
        expect(singleApp).toHaveProperty("avg_rating", expect.any(Number));
        expect(singleApp).toHaveProperty("developer_id", expect.any(Number));
        expect(singleApp).toHaveProperty("created_at", expect.any(String));
        expect(singleApp).toHaveProperty("updated_at", expect.any(String));
        expect(singleApp).toHaveProperty("issue_ids", expect.any(Array));
        expect(singleApp).toHaveProperty("rating_ids", expect.any(Array));
        expect(singleApp).toHaveProperty("comment_ids", expect.any(Array));
      });
      test("responds with 400 status and error message if app_id is not a number", async () => {
        const { body } = await request(app)
          .get("/api/apps/not-a-number")
          .expect(400);
        expect(body.msg).toBe("Invalid app ID");
      });
      test("responds with 404 status and error message if app does not exist", async () => {
        const { body } = await request(app).get("/api/apps/999").expect(404);
        expect(body.msg).toBe("App not found");
      });
    });

    describe("GET /api/apps/:app_id/comments", () => {
      test("Should return an array of comments for a given app", async () => {
        const {
          body: { comments },
        } = await request(app).get("/api/apps/1/comments").expect(200);
        comments.map((comment: Comment) => {
          expect(comment).toHaveProperty("id", expect.any(Number));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("author_id", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("updated_at", expect.any(String));
          expect(comment).toHaveProperty("author_username", expect.any(String));
        });
      });
      test("Should return an empty array if the app has no comments", async () => {
        const {
          body: { comments },
        } = await request(app).get("/api/apps/2/comments").expect(200);
        expect(comments).toEqual([]);
      });
      test("Should return 400 status and error message if app_id is not a number", async () => {
        const { body } = await request(app)
          .get("/api/apps/not-a-number/comments")
          .expect(400);
        expect(body.msg).toBe("Invalid app ID");
      });
      test("Should return 404 status and error message if app does not exist", async () => {
        const { body } = await request(app)
          .get("/api/apps/999/comments")
          .expect(404);
        expect(body.msg).toBe("App not found");
      });
    });
  });
});

describe("POST ENDPOINTS", () => {
  describe("POST /api/users", () => {
    test("should create a new user", async () => {
      const {
        body: { user },
      } = await request(app)
        .post("/api/users")
        .send({
          username: "testuser",
          name: "Test User",
          email: "testuser@example.com",
          password: "password",
          role: "user",
        })
        .expect(201);
      expect(user).toBeInstanceOf(Object);
      expect(user).toHaveProperty("id", expect.any(Number));
      expect(user).toHaveProperty("username", "testuser");
      expect(user).toHaveProperty("name", "Test User");
      expect(user).toHaveProperty("email", "testuser@example.com");
      expect(user).toHaveProperty("role", "user");
      expect(user).toHaveProperty("avg_rating", null);
      expect(user).toHaveProperty("created_at", expect.any(String));
      expect(user).toHaveProperty("updated_at", expect.any(String));
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
      expect(user).toHaveProperty("avg_rating", 4.5);
      expect(user).toHaveProperty("created_at", expect.any(String));
      expect(user).toHaveProperty("updated_at", expect.any(String));
    });
    test("should return 400 status and error message if required fields are missing", async () => {
      const { body } = await request(app)
        .post("/api/users")
        .send({})
        .expect(400);
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

  describe("POST /api/apps", () => {
    test("responds with 201 status and app", async () => {
      const addedApp = {
        name: "Test App",
        description: "Test Description",
        category: "AI",
        app_url: "https://test.com",
        app_img_url: "https://test.com/image.jpg",
        avg_rating: 4.5,
        developer_id: 1,
      };
      const {
        body: { newApp },
      } = await request(app).post("/api/apps").send(addedApp).expect(201);
      expect(newApp).toHaveProperty("id", expect.any(Number));
      expect(newApp).toHaveProperty("name", expect.any(String));
      expect(newApp).toHaveProperty("description", expect.any(String));
      expect(newApp).toHaveProperty("category", expect.any(String));
      expect(newApp).toHaveProperty("app_url", expect.any(String));
      expect(newApp).toHaveProperty("app_img_url", expect.any(String));
      expect(newApp).toHaveProperty("avg_rating", 4.5);
      expect(newApp).toHaveProperty("developer_id", expect.any(Number));
      expect(newApp).toHaveProperty("created_at", expect.any(String));
      expect(newApp).toHaveProperty("updated_at", expect.any(String));
      expect(newApp).toHaveProperty("issue_ids", expect.any(Array));
      expect(newApp).toHaveProperty("rating_ids", expect.any(Array));
      expect(newApp).toHaveProperty("comment_ids", expect.any(Array));
    });
    test("should return 400 status and error message if required fields are missing", async () => {
      const { body } = await request(app)
        .post("/api/apps")
        .send({})
        .expect(400);
      expect(body.msg).toBe("Missing required fields");
    });
    test("should return 400 status and error message if developer_id is not a number", async () => {
      const { body } = await request(app)
        .post("/api/apps")
        .send({
          name: "Test App",
          description: "Test App Description",
          category: "AI",
          app_url: "https://testapp.com",
          app_img_url: "https://testapp.com/image.jpg",
          avg_rating: 4.5,
          developer_id: "not-a-number",
        })
        .expect(400);
      expect(body.msg).toBe("Invalid developer_id");
    });
    test("should return 400 status and error message if category does not exist", async () => {
      const { body } = await request(app)
        .post("/api/apps")
        .send({
          name: "Test App",
          description: "Test App Description",
          category: "Non-existent Category",
          app_url: "https://testapp.com",
          app_img_url: "https://testapp.com/image.jpg",
          avg_rating: 4.5,
          developer_id: 1,
        })
        .expect(400);
      expect(body.msg).toBe("Category does not exist");
    });
    test("should return 403 status when non-developer user tries to create an app", async () => {
      const { body } = await request(app)
        .post("/api/apps")
        .send({
          name: "Test App",
          description: "Test App Description",
          category: "AI",
          app_url: "https://testapp.com",
          app_img_url: "https://testapp.com/image.jpg",
          avg_rating: 4.5,
          developer_id: 2, // Bob has 'user' role, not 'developer'
        })
        .expect(403);
      expect(body.msg).toBe(
        "Forbidden: Only users with developer role can create apps"
      );
    });
    test("should return 404 status when developer_id does not exist", async () => {
      const { body } = await request(app)
        .post("/api/apps")
        .send({
          name: "Test App",
          description: "Test App Description",
          category: "AI",
          app_url: "https://testapp.com",
          app_img_url: "https://testapp.com/image.jpg",
          avg_rating: 4.5,
          developer_id: 999, // Non-existent user ID
        })
        .expect(404);
      expect(body.msg).toBe("Developer not found");
    });
  });
});

describe("PATCH ENDPOINTS", () => {
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
      } = await request(app)
        .patch("/api/users/1")
        .send(patchedUser)
        .expect(200);
      expect(updatedUser).toHaveProperty("id", 1);
      expect(updatedUser).toHaveProperty("username", "updateduser");
      expect(updatedUser).toHaveProperty("name", "Updated User");
      expect(updatedUser).toHaveProperty("email", "updateduser@example.com");
      expect(updatedUser).toHaveProperty("role", "developer");
      expect(updatedUser).toHaveProperty("avg_rating", 4.5);
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
      } = await request(app)
        .patch("/api/users/1")
        .send(patchedUser)
        .expect(200);
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
      } = await request(app)
        .patch("/api/users/1")
        .send(patchedUser)
        .expect(200);
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
      } = await request(app)
        .patch("/api/users/1")
        .send(patchedUser)
        .expect(200);
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
      } = await request(app)
        .patch("/api/users/1")
        .send(patchedUser)
        .expect(200);
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
      } = await request(app)
        .patch("/api/users/1")
        .send(patchedUser)
        .expect(200);
      expect(updatedUser).toHaveProperty("id", 1);
      expect(updatedUser).toHaveProperty("username", user.username);
      expect(updatedUser).toHaveProperty("email", user.email);
    });
    test("should allow partial updates (avg_rating only)", async () => {
      const {
        body: { user },
      } = await request(app).get("/api/users/1").expect(200);
      expect(user).toHaveProperty("avg_rating", 4.5);
      const patchedUser = {
        avg_rating: 2,
      };
      const {
        body: { updatedUser },
      } = await request(app)
        .patch("/api/users/1")
        .send(patchedUser)
        .expect(200);
      expect(updatedUser).toHaveProperty("avg_rating", 2);
      expect(updatedUser.avg_rating).toEqual(expect.any(Number));
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

  describe("PATCH /api/apps/:app_id", () => {
    test("responds with 200 status and updated app", async () => {
      const updatedApp = {
        name: "Updated App",
        description: "Updated Description",
        category: "AI",
        app_url: "https://updatedapp.com",
        app_img_url: "https://updatedapp.com/image.jpg",
        developer_id: 1, // Same developer (Alice)
      };
      const {
        body: { updatedApp: result },
      } = await request(app).patch("/api/apps/1").send(updatedApp).expect(200);
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty("id", 1);
      expect(result).toHaveProperty("name", "Updated App");
      expect(result).toHaveProperty("description", "Updated Description");
      expect(result).toHaveProperty("category", "AI");
      expect(result).toHaveProperty("app_url", "https://updatedapp.com");
      expect(result).toHaveProperty(
        "app_img_url",
        "https://updatedapp.com/image.jpg"
      );
      expect(result).toHaveProperty("developer_id", 1);
    });
    test("should return 400 status and error message if app_id is not a number", async () => {
      const { body } = await request(app)
        .patch("/api/apps/not-a-number")
        .send({
          name: "Updated App",
        })
        .expect(400);
      expect(body.msg).toBe("Invalid app ID");
    });
    test("should return 400 status and error message if no fields to update", async () => {
      const { body } = await request(app)
        .patch("/api/apps/1")
        .send({})
        .expect(400);
      expect(body.msg).toBe("No fields to update");
    });
    test("should return 403 status when trying to assign app to different developer", async () => {
      const { body } = await request(app)
        .patch("/api/apps/1")
        .send({
          name: "Updated App",
          description: "Updated Description",
          category: "AI",
          app_url: "https://updatedapp.com",
          app_img_url: "https://updatedapp.com/image.jpg",
          developer_id: 3, // Charlie is a developer but not the owner of this app
        })
        .expect(403);
      expect(body.msg).toBe("Forbidden: This app does not belong to you.");
    });
    test("should return 403 status when trying to assign app to non-developer user", async () => {
      const { body } = await request(app)
        .patch("/api/apps/1")
        .send({
          developer_id: 2, // Bob has 'user' role, not 'developer'
        })
        .expect(403);
      expect(body.msg).toBe(
        "Forbidden: Only users with developer role can be assigned to apps"
      );
    });
    test("should return 404 status when developer_id does not exist", async () => {
      const { body } = await request(app)
        .patch("/api/apps/1")
        .send({
          developer_id: 999, // Non-existent user ID
        })
        .expect(404);
      expect(body.msg).toBe("Developer not found");
    });
    test("should return 404 status and error message if app does not exist", async () => {
      const { body } = await request(app)
        .patch("/api/apps/999")
        .send({
          name: "Updated App",
        })
        .expect(404);
      expect(body.msg).toBe("App not found");
    });
  });
});

describe("DELETE ENDPOINTS", () => {
  describe("DELETE /api/apps/:app_id", () => {
    test("responds with 200 status and deleted app", async () => {
      const { body } = await request(app)
        .delete("/api/apps/1")
        .send({ developer_id: 1 })
        .expect(200);
      expect(body.msg).toBe("App deleted successfully");
    });
    test("should return 400 status and error message if app_id is not a number", async () => {
      const { body } = await request(app)
        .delete("/api/apps/not-a-number")
        .expect(400);
      expect(body.msg).toBe("Invalid app ID");
    });
    test("should return 403 status when a developer tries to delete another developer's app", async () => {
      const { body } = await request(app)
        .delete("/api/apps/1")
        .send({ developer_id: 3 })
        .expect(403);
      expect(body.msg).toBe("Forbidden: You can only delete your own apps");
    });
    test("should return 404 status and error message if app does not exist", async () => {
      const { body } = await request(app).delete("/api/apps/999").expect(404);
      expect(body.msg).toBe("App not found");
    });
  });
});
