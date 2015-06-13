var app = require("./lib/app.js");

app.set("port", process.env.PORT || 3000);

app.listen(
  app.get("port"),
  function () {
    console.log("Server listening");
  }
);
