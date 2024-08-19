const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../../../.env"),
});
const request = require("supertest");
const app = require("../../../app.js");
const knexConfig = require("../../../db/knexfile");
const db = require("knex")(knexConfig["development"]);

const threadTemplate = {
  user_id: 4,
  title: "Test Thread Title",
  content: "This is the content of the test thread.",
};

describe("POST /api/threads", () => {
  let threadId;

  beforeEach(async () => {
    await db.raw("BEGIN");

    await db("users").insert({
      username: "testuser",
      email: `test${Date.now()}@student.ehb.be`,
      password: "password123",
      role: "student",
    });

    const [thread] = await db("threads")
      .insert({
        thread_id: Math.floor(Math.random() * 1000000),
        user_id: threadTemplate.user_id,
        title: threadTemplate.title,
        content: threadTemplate.content,
      })
      .returning("*");

    threadId = thread.thread_id;

    console.log("Inserted thread:", thread);
  });

  afterEach(async () => {
    await db.raw("ROLLBACK");
  });

  afterAll(async () => {
    await db.destroy();
  });

  test("should create a new thread with valid data", async () => {
    const response = await request(app)
      .post("/api/threads")
      .send(threadTemplate);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user_id", threadTemplate.user_id);
    expect(response.body).toHaveProperty("title", threadTemplate.title);
    expect(response.body).toHaveProperty("content", threadTemplate.content);

    await db.raw("COMMIT");

    const dbRecord = await db("threads")
      .select("*")
      .where("thread_id", response.body.thread_id)
      .first();
    expect(dbRecord).toBeDefined();
    expect(dbRecord.user_id).toEqual(threadTemplate.user_id);
    expect(dbRecord.title).toEqual(threadTemplate.title);
    expect(dbRecord.content).toEqual(threadTemplate.content);
  });

  test("should return 400 if user_id is missing", async () => {
    const { user_id, ...invalidThread } = threadTemplate;

    const response = await request(app)
      .post("/api/threads")
      .send(invalidThread);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "You need to be logged in to post a thread"
    );
  });

  test("should return 400 if title or content is missing", async () => {
    const invalidThread = { ...threadTemplate, title: "", content: "" };

    const response = await request(app)
      .post("/api/threads")
      .send(invalidThread);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "You need a title and content to create a new thread"
    );
  });

  test("should return 404 if user does not exist", async () => {
    const invalidThread = { ...threadTemplate, user_id: 999999 };

    const response = await request(app)
      .post("/api/threads")
      .send(invalidThread);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User does not exist");
  });
});
