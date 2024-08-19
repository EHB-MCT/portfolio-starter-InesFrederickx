const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../../../.env"),
});
const request = require("supertest");
const app = require("../../../app.js");
const knexConfig = require("../../../db/knexfile");
const db = require("knex")(knexConfig["development"]);

const userTemplate = {
  username: "testuser",
  email: "testuser1@ehb.be",
  password: "Password123?",
  role: "student",
};

describe("POST /api/users/register", () => {
  beforeEach(async () => {
    await db.raw("BEGIN");
  });

  afterAll(async () => {
    await db.destroy();
  });

  test("should return user information for a valid user", async () => {
    const uniqueEmail = `test${Date.now()}@student.ehb.be`;
    const newUser = { ...userTemplate, email: uniqueEmail };

    const response = await request(app)
      .post("/api/users/register")
      .send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("username", newUser.username);
    expect(response.body).toHaveProperty("email", newUser.email);
    expect(response.body).toHaveProperty("role", newUser.role);

    await db.raw("COMMIT");

    const dbRecord = await db("users")
      .select("*")
      .where("email", newUser.email)
      .first();
    expect(dbRecord).toBeDefined();
    expect(dbRecord.username).toEqual(newUser.username);
    expect(dbRecord.email).toEqual(newUser.email);
    expect(dbRecord.role).toEqual(newUser.role);

    expect(dbRecord.password).toBeDefined();
    expect(response.body.password).toBeUndefined();
  });
});
