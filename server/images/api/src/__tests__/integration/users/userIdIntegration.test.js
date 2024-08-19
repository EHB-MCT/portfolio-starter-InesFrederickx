const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "./../../../../.env"),
});
const request = require("supertest");
const assert = require("assert");
const app = require("../../../app.js");
const knexConfig = require("../../../db/knexfile");
const db = require("knex")(knexConfig["development"]);

describe("GET /api/users/:id", () => {
  //console.log(process.env.POSTGRES_USER); // Should output: myuser
  //console.log(process.env.POSTGRES_PASSWORD); // Should output: mypassword

  beforeAll(async () => {
    await db.raw("BEGIN");
  });

  afterAll(async () => {
    await db.destroy();
  });

  test("should return the correct user record", async () => {
    const userId = 5;

    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user_id", userId);

    expect(response.body.password).toBeUndefined();

    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("email");

    const dbRecord = await db("users")
      .select("*")
      .where("user_id", userId)
      .first();
    expect(dbRecord).toBeDefined();
    expect(dbRecord.user_id).toEqual(userId);
    expect(dbRecord).toHaveProperty("user_id", userId);

    expect(dbRecord.password).toBeDefined();
    expect(response.body.password).toBeUndefined();
  });

  test("should return 404 if the user does not exist", async () => {
    const nonExistentUserId = 999999;

    const response = await request(app).get(`/api/users/${nonExistentUserId}`);

    expect(response.status).toBe(404);

    const dbRecord = await db("users")
      .select("*")
      .where("user_id", nonExistentUserId);
    expect(dbRecord.length).toBe(0);
    expect(dbRecord).not.toHaveProperty("user_id", nonExistentUserId);
  });

  test("should return 401 for negative user_id", async () => {
    const negativeUserId = -12;

    const response = await request(app).get(`/api/users/${negativeUserId}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 if user_is is a string", async () => {
    const stringUserId = "hello";

    const response = await request(app).get(`/api/users/${stringUserId}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 if user_is is too long", async () => {
    const largeUserId = 2147483648;
    const response = await request(app).get(`/api/users/${largeUserId}`);
    expect(response.status).toBe(401);
  });
});
