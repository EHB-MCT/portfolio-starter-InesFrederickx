/**
 * Create the 'threads' table with the following columns:
 * - thread_id: Auto-incrementing integer primary key
 * - user_id: String foreign key referencing the 'users' table
 * - title: String, required
 * - content: Text, required
 * - posted_anonymously: Boolean, required, defaults to false
 * - timestamps: Created at and updated at columns
 * - index: Index on the 'user_id' column for faster lookups
 * - foreign key constraint: Enforces that 'user_id' references 'user_id' in the 'users' table and cascades on delete
 *
 * @param { import("knex").Knex } knex - The Knex instance for database operations
 * @returns { Promise<void> } - A promise that resolves when the migration completes
 */
exports.up = function (knex) {
  return knex.schema.createTable("threads", function (table) {
    table.increments("thread_id").primary();
    table.integer("user_id").notNullable();
    table.string("title").notNullable();
    table.text("content").notNullable();
    table.boolean("posted_anonymously").notNullable().defaultTo(false);

    table.timestamps(true, true);

    table.index("user_id");

    table
      .foreign("user_id")
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

/**
 * Drop the 'threads' table.
 *
 * @param { import("knex").Knex } knex - The Knex instance for database operations
 * @returns { Promise<void> } - A promise that resolves when the migration completes
 */
exports.down = function (knex) {
  return knex.schema.dropTable("threads");
};
