const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "./../../../../.env"),
});
const request = require("supertest");
const app = require("../../../app.js");
const knexConfig = require("../../../db/knexfile");
const db = require("knex")(knexConfig["development"]);

describe("GET /api/replies/:reply_id", () => {
  let testReply;

  beforeAll(async () => {
    await db.raw("BEGIN");

    testReply = {
      user_id: 4,
      thread_id: 1,
      content: "This is a test reply.",
    };

    const [insertedReply] = await db("replies")
      .insert(testReply)
      .returning("*");
    testReply.reply_id = insertedReply.reply_id;

    await db.raw("COMMIT");
  });

  afterAll(async () => {
    await db.raw("ROLLBACK");
    await db.destroy();
  });

  test("should return the correct reply record", async () => {
    const response = await request(app).get(
      `/api/replies/${testReply.reply_id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reply_id", testReply.reply_id);
    expect(response.body).toHaveProperty("user_id", testReply.user_id);
    expect(response.body).toHaveProperty("thread_id", testReply.thread_id);
    expect(response.body).toHaveProperty("content", testReply.content);

    const dbRecord = await db("replies")
      .select("*")
      .where("reply_id", testReply.reply_id)
      .first();
    expect(dbRecord).toBeDefined();
    expect(dbRecord.reply_id).toEqual(testReply.reply_id);
  });

  test("should return 404 if the reply does not exist", async () => {
    const nonExistentReplyId = 999999;

    const response = await request(app).get(
      `/api/replies/${nonExistentReplyId}`
    );

    expect(response.status).toBe(404);

    const dbRecord = await db("replies")
      .select("*")
      .where("reply_id", nonExistentReplyId);
    expect(dbRecord.length).toBe(0);
  });

  test("should return all replies if reply_id is missing", async () => {
    const response = await request(app).get(`/api/replies/`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should return 401 for negative reply_id", async () => {
    const negativeReplyId = -12;

    const response = await request(app).get(`/api/replies/${negativeReplyId}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 if reply_id is a string", async () => {
    const stringReplyId = "hello";

    const response = await request(app).get(`/api/replies/${stringReplyId}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 if reply_id is too long", async () => {
    const largeReplyId = 2147483648;
    const response = await request(app).get(`/api/replies/${largeReplyId}`);
    expect(response.status).toBe(401);
  });
});
