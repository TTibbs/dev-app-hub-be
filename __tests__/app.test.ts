import app from "../app";
import request from "supertest";
import db from "../db/connection";
import seed from "../db/seeds/seed";
import * as testData from "../db/data/test-data";
import endpoints from "../endpoints.json";

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
