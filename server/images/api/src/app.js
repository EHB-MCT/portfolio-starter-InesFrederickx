const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

const userRoutes = require("./routes/users");
const threadRoutes = require("./routes/threads");
const replyRoutes = require("./routes/replies");

app.use("/api/users", userRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/replies", replyRoutes);

module.exports = app;
