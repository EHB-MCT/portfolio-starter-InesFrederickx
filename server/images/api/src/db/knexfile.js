const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "store",
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: "5432",
    },
    migrations: {
      directory: path.resolve(__dirname, "./migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "./seeds"),
    },
  },
};
