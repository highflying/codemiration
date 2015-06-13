var express = require("express");
var swig    = require("swig");

var app = express();

app.engine("html", swig.renderFile);
app.set("view engine", "html");
app.use(express.static("static"));

if(app.get("env") === "development") {
  console.log("Turning caching off in development");
  app.set("view cache", false);
  swig.setDefaults({ cache: false });
}

app.get("/", frontPage);

function frontPage(req, res) {
  return res.render("front-page.html");
}

module.exports = app;
