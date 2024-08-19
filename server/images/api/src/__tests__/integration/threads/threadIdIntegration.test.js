const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "./../../../../.env"),
});
const request = require("supertest");
const app = require("../../../app.js");
const knexConfig = require("../../../db/knexfile");
const db = require("knex")(knexConfig["development"]);

describe("GET /api/threads/:thread_id", () => {
  let testThread;

  beforeAll(async () => {
    await db.raw("BEGIN");

    testThread = {
      user_id: 4,
      title: "Non Anonymous Thread",
      content: "This is the content of the first thread.",
      posted_anonymously: false,
    };

    const [insertedThread] = await db("threads")
      .insert(testThread)
      .returning("*");
    testThread.thread_id = insertedThread.thread_id;

    await db.raw("COMMIT");
  });

  afterAll(async () => {
    await db.raw("ROLLBACK");
    await db.destroy();
  });

  test("should return the correct thread record", async () => {
    const response = await request(app).get(
      `/api/threads/${testThread.thread_id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("thread_id", testThread.thread_id);
    expect(response.body).toHaveProperty("user_id", testThread.user_id);
    expect(response.body).toHaveProperty("title", testThread.title);
    expect(response.body).toHaveProperty("content", testThread.content);
    expect(response.body).toHaveProperty(
      "posted_anonymously",
      testThread.posted_anonymously
    );

    const dbRecord = await db("threads")
      .select("*")
      .where("thread_id", testThread.thread_id)
      .first();
    expect(dbRecord).toBeDefined();
    expect(dbRecord.thread_id).toEqual(testThread.thread_id);
  });

  test("should return 404 if the thread does not exist", async () => {
    const nonExistentThreadId = 999999;

    const response = await request(app).get(
      `/api/threads/${nonExistentThreadId}`
    );

    expect(response.status).toBe(404);

    const dbRecord = await db("threads")
      .select("*")
      .where("thread_id", nonExistentThreadId);
    expect(dbRecord.length).toBe(0);
  });

  test("should return 401 for negative thread_id", async () => {
    const negativeThreadId = -12;

    const response = await request(app).get(`/api/threads/${negativeThreadId}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 if thread_id is a string", async () => {
    const stringThreadId = "hello";

    const response = await request(app).get(`/api/threads/${stringThreadId}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 if thread_id is too long", async () => {
    const largeThreadId = 2147483648;
    const response = await request(app).get(`/api/threads/${largeThreadId}`);
    expect(response.status).toBe(401);
  });
});
