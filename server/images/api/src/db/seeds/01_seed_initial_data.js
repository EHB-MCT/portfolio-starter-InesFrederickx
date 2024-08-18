const bcrypt = require("bcryptjs");

/**
 * Seed the database with initial data.
 *
 * @param { import("knex").Knex } knex - The Knex instance for database operations
 * @returns { Promise<void> } - A promise that resolves when the seeding completes
 */
exports.seed = async function (knex) {
  // Clear existing data
  await knex("replies").del();
  await knex("threads").del();
  await knex("users").del();

  // Hash passwords
  const saltRounds = 10;
  const hashedPasswordJeanine = await bcrypt.hash("password123", saltRounds);
  const hashedPasswordBob = await bcrypt.hash("password456", saltRounds);
  const hashedPasswordElla = await bcrypt.hash("password789", saltRounds);

  // Seed users
  const users = await knex("users")
    .insert([
      {
        username: "jeanine",
        email: "jeanine@student.ehb.be",
        password: hashedPasswordJeanine,
        role: "student",
      },
      {
        username: "bob",
        email: "bob@ehb.be",
        password: hashedPasswordBob,
        role: "teacher",
      },
      {
        username: "ella",
        email: "ella@ehb.be",
        password: hashedPasswordElla,
        role: "admin",
      },
    ])
    .returning(["user_id", "username"]);

  // Extract user IDs
  const userMap = users.reduce((acc, user) => {
    acc[user.username] = user.user_id;
    return acc;
  }, {});

  // Seed threads
  const threads = await knex("threads")
    .insert([
      {
        user_id: userMap.jeanine,
        title: "Non Anonymous Thread",
        content: "This is the content of the first thread.",
        posted_anonymously: false,
      },
      {
        user_id: userMap.jeanine,
        title: "Anonymous Thread",
        content: "This is the content of the second thread.",
        posted_anonymously: true,
      },
    ])
    .returning(["thread_id", "title"]);

  // Extract thread IDs
  const threadMap = threads.reduce((acc, thread) => {
    acc[thread.title] = thread.thread_id;
    return acc;
  }, {});

  // Seed replies
  await knex("replies").insert([
    {
      user_id: userMap.bob,
      thread_id: threadMap["Non Anonymous Thread"],
      content: "This is a reply to the non anonymous thread that is correct.",
      correct: true,
    },
    {
      user_id: userMap.ella,
      thread_id: threadMap["Anonymous Thread"],
      content: "This is a reply to the anonymous thread that is not checked.",
      correct: false,
    },
  ]);
};
