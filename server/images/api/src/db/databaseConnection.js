const knex = require("knex");
const knexfile = require("./knexfile");

const environment = "development";

/**
 * Initialize and export the Knex database connection for the current environment.
 *
 * @type {import("knex").Knex} - Configured Knex instance
 */

const databaseConnection = knex(knexfile[environment]);

module.exports = databaseConnection;
