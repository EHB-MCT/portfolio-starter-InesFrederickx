/**
 * Create the 'users' table with the following columns:
 * - user_id: Auto-incrementing integer primary key
 * - username: String, required
 * - email: String, required, unique
 * - role: ENUM, required (only 'student', 'teacher', 'admin' allowed)
 * - password: String, required
 * - timestamps: Created at and updated at columns
 * - index: Email column indexed for faster lookups
 *
 * @param { import("knex").Knex } knex - The Knex instance for database operations
 * @returns { Promise<void> } - A promise that resolves when the migration completes
 */
exports.up = async function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("user_id").primary();
    table.string("username", 50).notNullable();
    table.string("email", 50).notNullable().unique();
    table.string("password", 255).notNullable();
    table
      .enu("role", ["student", "teacher", "admin"], {
        useNative: true,
        enumName: "user_role",
      })
      .notNullable();

    table.timestamps(true, true);

    table.index("email");
  });
};

/**
 * Drop the 'users' table and remove the ENUM type.
 *
 * @param { import("knex").Knex } knex - The Knex instance for database operations
 * @returns { Promise<void> } - A promise that resolves when the migration completes
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("users");

  await knex.raw(`DROP TYPE user_role`);
};
