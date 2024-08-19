const express = require("express");
const router = express.Router();
const databaseConnection = require("../db/databaseConnection");
const {
  checkThreadTitle,
  checkThreadContent,
} = require("../helpers/threadEndpointHelpers");

/**
 * Thread Parameters
 *
 * Represents the structure of a thread object in the system.
 *
 * @typedef {object} Thread
 * @property {number} thread_id - Unique identifier for the thread.
 * @property {number} user_id - ID of the user who created the thread.
 * @property {string} title - Title of the thread.
 * @property {string} content - Content of the thread.
 * @property {boolean} posted_anonymously - Indicates if the thread was posted anonymously.
 * @property {string} created_at - Timestamp of when the thread was created.
 * @property {string} updated_at - Timestamp of when the thread was last updated.
 */

/**
 * GET /threads
 *
 * This route retrieves all threads from the database.
 * If threads are found, it returns a list of threads as JSON.
 * If there are no threads, it returns a 404 Not Found error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Thread[]} 200 - An array of thread objects.
 * @returns {Error} 404 - No threads available at the moment.
 * @returns {Error} 500 - Failed to retrieve threads.
 */
router.get("/", async (req, res) => {
  try {
    const threads = await databaseConnection("threads").select("*");

    if (threads.length === 0) {
      return res
        .status(404)
        .json({ message: "No threads available at the moment." });
    }

    res.json(threads);
  } catch (error) {
    console.error("Error retrieving threads:", error);
    res.status(500).json({ error: "Failed to retrieve threads" });
  }
});

/**
 * GET /threads/{thread_id}
 *
 * This route retrieves a specific thread's information based on the provided thread_id.
 * It expects the thread_id as a parameter in the URL.
 * If the thread is found, it returns the thread's information as JSON.
 * If the thread is not found, it returns a 404 Not Found error.
 *
 * @param {string} thread_id.path.required - The ID of the thread to retrieve.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Thread} 200 - Thread object.
 * @returns {Error} 404 - Thread not found.
 * @returns {Error} 500 - Failed to retrieve thread.
 */
router.get("/:thread_id", async (req, res) => {
  const thread_id = parseInt(req.params.thread_id, 10);

  if (isNaN(thread_id) || thread_id <= 0 || thread_id > 2147483647) {
    return res.status(401).json({
      error: "Invalid thread_id",
      message: "The thread_id must be a positive integer.",
    });
  }

  try {
    // Select specific fields
    const thread = await databaseConnection("threads")
      .select(
        "thread_id",
        "user_id",
        "title",
        "content",
        "posted_anonymously",
        "created_at",
        "updated_at"
      )
      .where({ thread_id })
      .first();

    if (!thread) {
      return res.status(404).json({
        error: "Thread not found",
        message: `No thread exists with the thread_id: ${thread_id}`,
      });
    }

    res.json(thread);
  } catch (error) {
    console.error("Error retrieving thread:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message:
        "An unexpected error occurred while retrieving thread information.",
    });
  }
});

/**
 * GET /threads/user/{user_id}
 *
 * This route retrieves all threads created by a specific user based on the provided user_id.
 * It expects the user_id as a parameter in the URL.
 * If the user exists and threads are found, it returns a list of threads as JSON.
 * If the user does not exist, it returns a 404 Not Found error.
 * If no threads are found for the user, it returns a 404 Not Found error.
 *
 * @param {string} user_id.path.required - The ID of the user whose threads to retrieve.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Thread[]} 200 - An array of thread objects created by the user.
 * @returns {Error} 404 - User not found or no threads found for this user.
 * @returns {Error} 500 - Failed to retrieve threads for user.
 */
router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const userExists = await databaseConnection("users")
      .where({ user_id })
      .first();

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const threads = await databaseConnection("threads").where({ user_id });

    if (threads.length === 0) {
      return res.status(404).json({ error: "No threads found for this user" });
    }

    res.json(threads);
  } catch (error) {
    console.error("Error retrieving threads for user:", error);
    res.status(500).json({ error: "Failed to retrieve threads for user" });
  }
});

/**
 * POST /threads
 *
 * This route creates a new thread in the database. It expects the thread details in the request body.
 * It checks for required parameters (user_id, title, content) and verifies if the user_id exists.
 * If the thread is successfully created, it returns the new thread's information as JSON.
 * If the user_id is missing or invalid, or if title and content are not provided, it returns an appropriate error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The details of the thread to create.
 * @param {number} req.body.user_id.required - The ID of the user creating the thread.
 * @param {string} req.body.title.required - The title of the thread.
 * @param {string} req.body.content.required - The content of the thread.
 * @param {object} res - The HTTP response object.
 * @returns {Thread} 201 - Created thread object.
 * @returns {Error} 400 - Missing required fields or invalid user.
 * @returns {Error} 404 - User not found.
 * @returns {Error} 500 - Failed to create thread.
 */
router.post("/", async (req, res) => {
  const { user_id, title, content } = req.body;

  if (!user_id) {
    return res
      .status(400)
      .json({ error: "You need to be logged in to post a thread" });
  }

  if (!checkThreadTitle(title) || !checkThreadContent(content)) {
    return res.status(400).json({
      error: "You need a title and content to create a new thread",
    });
  }

  try {
    const userExists = await databaseConnection("users")
      .where({ user_id })
      .first();

    if (!userExists) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const [newThread] = await databaseConnection("threads")
      .insert({ user_id, title, content })
      .returning("*");

    res.status(201).json(newThread);
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({ error: "Failed to create thread" });
  }
});

/**
 * PUT /threads/{thread_id}
 *
 * This route updates a specific thread's information based on the provided thread_id.
 * It expects the thread_id as a parameter in the URL and the fields to update in the request body.
 * It checks if the fields being updated are valid and if the new data adheres to the original rules.
 * If the thread is found and updated, it returns the updated thread's information.
 * If the thread is not found, it returns a 404 Not Found error.
 * If any field being updated is invalid or the update violates rules, it returns a 400 Bad Request error.
 *
 * @param {string} thread_id.path.required - The ID of the thread to update.
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The fields to update in the thread object.
 * @param {number} [req.body.user_id] - The ID of the user creating the thread.
 * @param {string} [req.body.title] - The title of the thread.
 * @param {string} [req.body.content] - The content of the thread.
 * @param {boolean} [req.body.posted_anonymously] - Indicates if the thread is posted anonymously.
 * @param {object} res - The HTTP response object.
 * @returns {Thread} 200 - Updated thread object.
 * @returns {Error} 400 - Invalid fields or update rule violations.
 * @returns {Error} 404 - Thread not found.
 * @returns {Error} 500 - Failed to update thread.
 */
router.put("/:thread_id", async (req, res) => {
  const validFields = ["user_id", "title", "content", "posted_anonymously"];
  const updates = req.body;

  const invalidFields = Object.keys(updates).filter(
    (key) => !validFields.includes(key)
  );
  if (invalidFields.length > 0) {
    return res.status(400).json({
      error: "Invalid fields",
      message: `The following fields are not valid: ${invalidFields.join(
        ", "
      )}`,
    });
  }

  if (
    (updates.title && typeof updates.title !== "string") ||
    (updates.content && typeof updates.content !== "string")
  ) {
    return res.status(400).json({
      error: "Invalid data type",
      message: "Title and content must be strings.",
    });
  }

  try {
    const existingThread = await databaseConnection("threads")
      .where({ thread_id: req.params.thread_id })
      .first();

    if (!existingThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const [updatedThread] = await databaseConnection("threads")
      .where({ thread_id: req.params.thread_id })
      .update(updates)
      .returning("*");

    if (!updatedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(updatedThread);
  } catch (error) {
    console.error("Error updating thread:", error);
    res.status(500).json({ error: "Failed to update thread" });
  }
});

/**
 * DELETE /threads/{thread_id}
 *
 * This route deletes a specific thread from the database based on the provided thread_id.
 * It expects the thread_id as a parameter in the URL.
 * It first checks if the thread exists. If it does, it performs the deletion.
 * If the thread is not found, it returns a 404 Not Found error.
 * If any error occurs during deletion, it returns a 500 Internal Server Error.
 *
 * @param {string} thread_id.path.required - The ID of the thread to delete.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} 200 - Confirmation message of successful deletion.
 * @returns {Error} 404 - Thread not found.
 * @returns {Error} 500 - Failed to delete thread.
 */
router.delete("/:thread_id", async (req, res) => {
  try {
    const existingThread = await databaseConnection("threads")
      .where({ thread_id: req.params.thread_id })
      .first();

    if (!existingThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const deletedCount = await databaseConnection("threads")
      .where({ thread_id: req.params.thread_id })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Failed to delete thread" });
    }

    res.status(200).json({ message: "Thread successfully deleted" });
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

module.exports = router;
