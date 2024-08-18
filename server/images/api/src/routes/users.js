const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const databaseConnection = require("../db/databaseConnection");

/**
 * User Parameters
 *
 * Represents the structure of a user object in the system.
 *
 * @typedef {object} User
 * @property {number} user_id - Unique identifier for the user.
 * @property {string} username - Name of the user.
 * @property {string} email - Email address of the user.
 * @property {string} password - Password of the user.
 * @property {string} role - Role of the user (e.g., student, teacher).
 * @property {string} created_at - Timestamp of when the user record was created.
 * @property {string} updated_at - Timestamp of when the user record was last updated.
 */

/**
 * GET /users
 *
 * This route retrieves all users from the database.
 * If users are found, it returns a list of users as JSON.
 * If there are no users, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {User[]} 200 - An array of user objects.
 * @returns {Error} 404 - No current users.
 * @returns {Error} 500 - Failed to retrieve users.
 */
router.get("/", async (req, res) => {
  try {
    const users = await databaseConnection("users").select("*");

    if (users.length === 0) {
      return res.status(404).json({ error: "No current users" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

/**
 * GET /users/{user_id}
 *
 * This route retrieves a specific user's information from the database based on the provided user_id.
 * It expects the user_id as a parameter in the URL.
 * If the user is found, it returns the user's information as JSON.
 * If the user is not found, it returns a 404 Not Found error.
 *
 * @param {string} user_id.path.required - The ID of the user to retrieve.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {User} 200 - User object.
 * @returns {Error} 404 - User not found.
 * @returns {Error} 500 - Internal Server Error.
 */
router.get("/:user_id", async (req, res) => {
  try {
    const user = await databaseConnection("users")
      .where({ user_id: req.params.user_id })
      .first();

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: `No user exists with the user_id: ${req.params.user_id}`,
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message:
        "An unexpected error occurred while retrieving user information.",
    });
  }
});

/**
 * POST /users/register
 *
 * This route creates a new user in the database. It expects a username, email, and password in the request body.
 * The email domain is used to determine the user's role (either student or teacher).
 * The password is hashed before storing it in the database.
 * If any required fields are missing or the email is invalid, it returns a 400 Bad Request error.
 * If the email already exists, it returns a 409 Conflict error.
 * If the user is successfully created, it returns the new user's information as JSON.
 *
 * @param {object} req - The HTTP request object.
 * @param {string} req.body.username.required - The username of the new user.
 * @param {string} req.body.email.required - The email of the new user.
 * @param {string} req.body.password.required - The password of the new user.
 * @param {object} res - The HTTP response object.
 * @returns {User} 201 - Created user object.
 * @returns {Error} 400 - Missing required fields or invalid email domain.
 * @returns {Error} 409 - Email already exists.
 * @returns {Error} 500 - Failed to create user.
 */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await databaseConnection("users")
      .where({ email })
      .first();

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    let role;
    if (email.endsWith("@student.ehb.be")) {
      role = "student";
    } else if (email.endsWith("@ehb.be")) {
      role = "teacher";
    } else {
      return res.status(400).json({ error: "Invalid email domain" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await databaseConnection("users")
      .insert({ username, email, password: hashedPassword, role })
      .returning([
        "user_id",
        "username",
        "email",
        "role",
        "created_at",
        "updated_at",
      ]);

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

/**
 * POST /users/login
 *
 * This route logs in a user. It expects an email and password in the request body.
 * If the credentials are valid, it returns a success message along with the user's information (excluding the password).
 * If any required fields are missing or the credentials are invalid, it returns a 400 Bad Request or 401 Unauthorized error respectively.
 *
 * @param {object} req - The HTTP request object.
 * @param {string} req.body.email.required - The email of the user.
 * @param {string} req.body.password.required - The password of the user.
 * @param {object} res - The HTTP response object.
 * @returns {object} 200 - Login successful with user object (excluding password).
 * @returns {Error} 400 - Missing required fields.
 * @returns {Error} 401 - Invalid credentials.
 * @returns {Error} 500 - Error validating login.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email && !password) {
    return res.status(400).json({
      error: "Both email and password are required",
    });
  }
  if (!email) {
    return res.status(400).json({
      error: "Email is required",
    });
  }

  if (!password) {
    return res.status(400).json({
      error: "Password is required",
    });
  }

  try {
    const user = await databaseConnection("users").where({ email }).first();

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const { password, ...userWithoutPassword } = user;
        res.json({ message: "Login successful", user: userWithoutPassword });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      error: "An error occurred while trying to validate the login.",
    });
  }
});

/**
 * PUT /users/{user_id}
 *
 * This route updates a user's information based on the provided user_id.
 * It expects the user_id as a parameter in the URL and the fields to update in the request body.
 * If the user is found and updated, it returns the updated user's information.
 * If the user is not found, it returns a 404 Not Found error.
 *
 * @param {string} user_id.path.required - The ID of the user to update.
 * @param {object} req - The HTTP request object.
 * @param {User} req.body.required - Fields to update in the user object.
 * @param {object} res - The HTTP response object.
 * @returns {User} 200 - Updated user object.
 * @returns {Error} 404 - User not found.
 * @returns {Error} 500 - Failed to update user.
 */
router.put("/:user_id", async (req, res) => {
  try {
    const updatedUser = await databaseConnection("users")
      .where({ user_id: req.params.user_id })
      .update(req.body)
      .returning("*");

    if (!updatedUser.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

/**
 * DELETE /users/{user_id}
 *
 * This route deletes a specific user from the database based on the provided user_id.
 * It expects the user_id as a parameter in the URL.
 * If the user is found and deleted, it returns a success message.
 * If the user is not found, it returns a 404 Not Found error.
 *
 * @param {string} user_id.path.required - The ID of the user to delete.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} 200 - Confirmation message of successful deletion.
 * @returns {Error} 404 - User not found.
 * @returns {Error} 500 - Failed to delete user.
 */
router.delete("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await databaseConnection("users").where({ user_id }).first();

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: `No user exists with the user_id: ${user_id}`,
      });
    }

    const deletedCount = await databaseConnection("users")
      .where({ user_id })
      .del();

    if (deletedCount > 0) {
      res.status(200).json({ message: "User successfully deleted" });
    } else {
      res.status(404).json({
        error: "Deletion failed",
        message: `Failed to delete user with user_id: ${user_id}. This might be due to an unexpected issue.`,
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Failed to delete user",
      message:
        "An unexpected error occurred while attempting to delete the user.",
    });
  }
});

module.exports = router;
