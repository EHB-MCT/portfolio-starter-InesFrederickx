const express = require("express");
const app = express();

app.get("/", (request, response) => {
  response.send({ message: "Hello world!" });
});

app.listen(3000, (err) => {
  if (!err) {
    console.log("Server is running on port " + 3000);
  } else {
    console.error(err);
  }
});
