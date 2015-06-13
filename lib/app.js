var express = require("express");
var swig    = require("swig");

var app = express();

app.engine("html", swig.renderFile);
app.set("view engine", "html");

app.get("/", frontPage);

function frontPage(req, res) {
  return res.render("front-page.html");
}

module.exports = app;
