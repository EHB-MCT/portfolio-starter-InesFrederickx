/**
 * Create the 'replies' table with the following columns:
 * - reply_id: Auto-incrementing integer primary key
 * - user_id: Integer foreign key referencing the 'users' table
 * - thread_id: Integer foreign key referencing the 'threads' table
 * - content: String, required
 * - correct: Boolean, required, defaults to false
 * - timestamps: Created at and updated at columns
 * - index: Index on the 'user_id' and 'thread_id' columns for faster lookups
 * - foreign key constraints: Enforces that 'user_id' references 'user_id' in the 'users' table and 'thread_id' references 'thread_id' in the 'threads' table, both cascading on delete
 *
 * @param { import("knex").Knex } knex - The Knex instance for database operations
 * @returns { Promise<void> } - A promise that resolves when the migration completes
 */
exports.up = function (knex) {
  return knex.schema.createTable("replies", function (table) {
    table.increments("reply_id").primary();
    table.integer("user_id").notNullable();
    table.integer("thread_id").notNullable();
    table.string("content").notNullable();
    table.boolean("correct").notNullable().defaultTo(false);

    table.timestamps(true, true);

    table.index("user_id");
    table.index("thread_id");

    table
      .foreign("user_id")
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .foreign("thread_id")
      .references("thread_id")
      .inTable("threads")
      .onDelete("CASCADE");
  });
};

/**
 * Drop the 'replies' table.
 *
 * @param { import("knex").Knex } knex - The Knex instance for database operations
 * @returns { Promise<void> } - A promise that resolves when the migration completes
 */
exports.down = function (knex) {
  return knex.schema.dropTable("replies");
};
