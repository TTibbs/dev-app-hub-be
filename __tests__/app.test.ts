import app from "../app";
import request from "supertest";
import db from "../db/connection";
import seed from "../db/seeds/seed";
import * as testData from "../db/data/test-data";

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

describe("Basic Express Server Tests", () => {
  test("GET / responds with 200 status and a message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: "Welcome to the API!" });
  });
});
