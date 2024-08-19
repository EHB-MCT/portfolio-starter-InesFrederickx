const express = require("express");
const router = express.Router();
const databaseConnection = require("../db/databaseConnection");
const { checkReplyContent } = require("../helpers/replyEndpointHelpers");

/**
 * Reply Parameters
 *
 * Represents the structure of a reply object in the system.
 *
 * @typedef {object} Reply
 * @property {number} reply_id - Unique identifier for the reply.
 * @property {number} thread_id - ID of the thread to which the reply belongs.
 * @property {number} user_id - ID of the user who created the reply.
 * @property {string} content - Content of the reply.
 * @property {boolean} correct - Indicates if the reply is marked as correct.
 * @property {string} created_at - Timestamp of when the reply was created.
 * @property {string} updated_at - Timestamp of when the reply was last updated.
 */

/**
 * GET /replies
 *
 * This route retrieves all replies from the database.
 * If replies are found, it returns a list of all replies.
 * If no replies are found, it returns a 404 Not Found error with a descriptive message.
 * If there is an issue retrieving replies, it returns a 500 Internal Server Error.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Reply[]} 200 - An array of all reply objects.
 * @returns {Error} 404 - No replies found.
 * @returns {Error} 500 - Failed to retrieve replies.
 */
router.get("/", async (req, res) => {
  try {
    const replies = await databaseConnection("replies").select("*");

    if (replies.length === 0) {
      return res
        .status(404)
        .json({ error: "No replies found in the database" });
    }

    res.json(replies);
  } catch (error) {
    console.error("Error retrieving replies:", error);
    res.status(500).json({ error: "Failed to retrieve replies" });
  }
});

/**
 * GET /replies/{reply_id}
 *
 * This route retrieves a specific reply based on the provided reply_id.
 * It expects the reply_id as a parameter in the URL.
 * If the reply is found, it returns the reply's details.
 * If the reply is not found, it returns a 404 Not Found error.
 * If there is an issue retrieving the reply, it returns a 500 Internal Server Error.
 *
 * @param {string} reply_id.path.required - The ID of the reply to retrieve.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Reply} 200 - The details of the requested reply.
 * @returns {Error} 404 - Reply not found.
 * @returns {Error} 500 - Failed to retrieve reply.
 */
router.get("/:reply_id?", async (req, res) => {
  try {
    const { reply_id } = req.params;

    if (!reply_id) {
      // Fetch all replies if no reply_id is provided
      const replies = await databaseConnection("replies").select("*");
      return res.json(replies);
    }

    const replyIdInt = parseInt(reply_id, 10);
    if (isNaN(replyIdInt) || replyIdInt <= 0 || replyIdInt > 2147483647) {
      return res.status(401).json({ error: "Invalid Reply ID." });
    }

    const reply = await databaseConnection("replies")
      .where({ reply_id: replyIdInt })
      .first();

    if (!reply) {
      return res
        .status(404)
        .json({ error: `Reply with ID ${reply_id} not found.` });
    }

    res.json(reply);
  } catch (error) {
    console.error("Error retrieving reply:", error);
    res.status(500).json({ error: "Failed to retrieve reply" });
  }
});

/**
 * GET /replies/thread/{thread_id}
 *
 * This route retrieves all replies associated with a specific thread based on the provided thread_id.
 * It expects the thread_id as a parameter in the URL.
 * It first checks if the thread exists. If the thread does not exist, it returns a 404 Not Found error.
 * If replies are found for the thread, it returns a list of replies.
 * If no replies are found, it returns a 404 Not Found error.
 * If there is an issue retrieving the replies, it returns a 500 Internal Server Error.
 *
 * @param {string} thread_id.path.required - The ID of the thread whose replies to retrieve.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Reply[]} 200 - An array of replies associated with the thread.
 * @returns {Error} 404 - Thread not found or no replies found for this thread.
 * @returns {Error} 500 - Failed to retrieve replies for this thread.
 */
router.get("/thread/:thread_id", async (req, res) => {
  try {
    const { thread_id } = req.params;

    const threadExists = await databaseConnection("threads")
      .where({ thread_id })
      .first();

    if (!threadExists) {
      return res
        .status(404)
        .json({ error: `Thread with ID ${thread_id} not found.` });
    }

    const replies = await databaseConnection("replies").where({ thread_id });

    if (replies.length === 0) {
      return res
        .status(404)
        .json({ error: `No replies found for thread with ID ${thread_id}.` });
    }

    res.json(replies);
  } catch (error) {
    console.error("Error retrieving replies for thread:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve replies for this thread" });
  }
});

/**
 * GET /replies/user/{user_id}
 *
 * This route retrieves all replies made by a specific user based on the provided user_id.
 * It expects the user_id as a parameter in the URL.
 * It first checks if the user exists. If the user does not exist, it returns a 404 Not Found error.
 * If replies are found for the user, it returns a list of replies.
 * If no replies are found, it returns a 404 Not Found error.
 * If there is an issue retrieving the replies, it returns a 500 Internal Server Error.
 *
 * @param {string} user_id.path.required - The ID of the user whose replies to retrieve.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Reply[]} 200 - An array of replies made by the user.
 * @returns {Error} 404 - User not found or no replies found for this user.
 * @returns {Error} 500 - Failed to retrieve replies for this user.
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const userExists = await databaseConnection("users")
      .where({ user_id })
      .first();

    if (!userExists) {
      return res
        .status(404)
        .json({ error: `User with ID ${user_id} not found.` });
    }

    const replies = await databaseConnection("replies").where({ user_id });

    if (replies.length === 0) {
      return res
        .status(404)
        .json({ error: `No replies found for user with ID ${user_id}.` });
    }

    res.json(replies);
  } catch (error) {
    console.error("Error retrieving replies for user:", error);
    res.status(500).json({ error: "Failed to retrieve replies for this user" });
  }
});

/**
 * GET /replies/thread/{thread_id}/user/{user_id}
 *
 * This route retrieves all replies made by a specific user in a specific thread.
 * It expects both thread_id and user_id as parameters in the URL.
 * It first checks if both the thread and user exist. If either does not exist, it returns a 404 Not Found error.
 * If replies are found for the specified thread and user, it returns a list of replies.
 * If no replies are found, it returns a 404 Not Found error.
 * If there is an issue retrieving the replies, it returns a 500 Internal Server Error.
 *
 * @param {string} thread_id.path.required - The ID of the thread whose replies to retrieve.
 * @param {string} user_id.path.required - The ID of the user whose replies to retrieve.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {Reply[]} 200 - An array of replies for the thread and user.
 * @returns {Error} 404 - Thread or user not found or no replies found.
 * @returns {Error} 500 - Failed to retrieve replies for this thread and user.
 */
router.get("/thread/:thread_id/user/:user_id", async (req, res) => {
  const { thread_id, user_id } = req.params;

  try {
    const threadExists = await databaseConnection("threads")
      .where({ thread_id })
      .first();

    if (!threadExists) {
      return res
        .status(404)
        .json({ error: `Thread with ID ${thread_id} not found.` });
    }

    const userExists = await databaseConnection("users")
      .where({ user_id })
      .first();

    if (!userExists) {
      return res
        .status(404)
        .json({ error: `User with ID ${user_id} not found.` });
    }

    const replies = await databaseConnection("replies").where({
      thread_id,
      user_id,
    });

    if (replies.length === 0) {
      return res.status(404).json({
        error: `No replies found for thread with ID ${thread_id} and user with ID ${user_id}.`,
      });
    }

    res.json(replies);
  } catch (error) {
    console.error("Error retrieving replies for thread and user:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve replies for this thread and user" });
  }
});

/**
 * POST /replies/thread/{thread_id}
 *
 * This route creates a new reply for a specific thread.
 * It expects the thread_id as a URL parameter and reply details in the request body.
 * It checks for required fields (user_id and content) and verifies if the thread exists.
 * If the reply is successfully created, it returns the new reply's information as JSON.
 * If any required fields are missing, if the thread does not exist, or if there is an issue creating the reply,
 * it returns an appropriate error.
 *
 * @param {string} thread_id.path.required - The ID of the thread where the reply will be posted.
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The details of the reply to create.
 * @param {number} req.body.user_id.required - The ID of the user creating the reply.
 * @param {string} req.body.content.required - The content of the reply.
 * @param {object} res - The HTTP response object.
 * @returns {Reply} 201 - Created reply object.
 * @returns {Error} 400 - Missing required fields.
 * @returns {Error} 404 - Thread not found.
 * @returns {Error} 500 - Failed to create reply.
 */
router.post("/thread/:thread_id", async (req, res) => {
  const { thread_id } = req.params;
  const { user_id, content } = req.body;

  if (checkReplyContent(content)) {
    if (!user_id || !content) {
      return res.status(400).json({
        error: "Missing required fields: user_id and content are required.",
      });
    }

    try {
      const threadExists = await databaseConnection("threads")
        .where({ thread_id })
        .first();

      if (!threadExists) {
        return res
          .status(404)
          .json({ error: `Thread with ID ${thread_id} not found.` });
      }

      const [newReply] = await databaseConnection("replies")
        .insert({ thread_id, user_id, content })
        .returning("*");

      if (!newReply) {
        return res
          .status(500)
          .json({ error: "Failed to create reply. Please try again." });
      }

      res.status(201).json(newReply);
    } catch (error) {
      console.error("Error creating reply:", error);
      res
        .status(500)
        .json({ error: "Failed to create reply due to server error." });
    }
  } else {
    res.status(400).json({ error: "Invalid content." });
  }
});

/**
 * PUT /replies/{reply_id}
 *
 * This route updates a specific reply's information based on the provided reply_id.
 * It expects the reply_id as a parameter in the URL and the fields to update in the request body.
 * It checks if the fields being updated are valid, if the reply exists, and if the updated information meets the requirements.
 * If the reply is found and updated, it returns the updated reply's information.
 * If the reply is not found, invalid fields are provided, or the updated information does not meet the requirements, it returns an appropriate error.
 *
 * @param {string} reply_id.path.required - The ID of the reply to update.
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The fields to update in the reply object.
 * @param {string} [req.body.content] - The new content of the reply (optional).
 * @param {boolean} [req.body.correct] - Indicates if the reply is marked as correct (optional).
 * @param {object} res - The HTTP response object.
 * @returns {Reply} 200 - Updated reply object.
 * @returns {Error} 400 - Invalid fields in update request, invalid data, or no fields provided.
 * @returns {Error} 404 - Reply not found.
 * @returns {Error} 500 - Failed to update reply.
 */
router.put("/:reply_id", async (req, res) => {
  const validFields = ["content", "correct"];
  const updateFields = Object.keys(req.body);

  const invalidFields = updateFields.filter(
    (field) => !validFields.includes(field)
  );

  if (checkReplyContent(content)) {
    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid fields: ${invalidFields.join(", ")}` });
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error:
          "No fields provided for update. At least one valid field must be included.",
      });
    }

    if (
      req.body.content &&
      (typeof req.body.content !== "string" || req.body.content.trim() === "")
    ) {
      return res
        .status(400)
        .json({ error: "Content must be a non-empty string." });
    }

    if (req.body.correct && typeof req.body.correct !== "boolean") {
      return res
        .status(400)
        .json({ error: "The 'correct' field must be a boolean value." });
    }

    try {
      const [updatedReply] = await databaseConnection("replies")
        .where({ reply_id: req.params.reply_id })
        .update(req.body)
        .returning("*");

      if (!updatedReply) {
        return res
          .status(404)
          .json({ error: `Reply with ID ${req.params.reply_id} not found.` });
      }

      res.json(updatedReply);
    } catch (error) {
      console.error("Error updating reply:", error);
      res
        .status(500)
        .json({ error: "Failed to update reply due to a server error." });
    }
  }
});

/**
 * DELETE /replies/{reply_id}
 *
 * This route deletes a specific reply based on the provided reply_id.
 * It expects the reply_id as a parameter in the URL.
 * It first checks if the reply exists. If it does, it performs the deletion.
 * If the reply is not found, it returns a 404 Not Found error.
 * If any error occurs during deletion, it returns a 500 Internal Server Error.
 *
 * @param {string} reply_id.path.required - The ID of the reply to delete.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} 200 - Confirmation message of successful deletion.
 * @returns {Error} 404 - Reply not found.
 * @returns {Error} 500 - Failed to delete reply.
 */
router.delete("/:reply_id", async (req, res) => {
  try {
    const existingReply = await databaseConnection("replies")
      .where({ reply_id: req.params.reply_id })
      .first();

    if (!existingReply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    const deletedCount = await databaseConnection("replies")
      .where({ reply_id: req.params.reply_id })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Failed to delete reply" });
    }

    res.status(200).json({ message: "Reply successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reply" });
  }
});

module.exports = router;
