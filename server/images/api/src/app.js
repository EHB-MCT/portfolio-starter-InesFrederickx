const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

// Import route modules
const userRoutes = require("./routes/users");
const threadRoutes = require("./routes/threads");
const replyRoutes = require("./routes/replies");

// Use route modules
app.use("/api/users", userRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/replies", replyRoutes);

module.exports = app;
