const app = require("./app");

app.listen(3000, (err) => {
  if (!err) {
    console.log("Server is running on port " + 3000);
  } else {
    console.error(err);
  }
});
