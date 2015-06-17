var app    = require("./lib/app.js");
var async  = require("async");
var books  = require("./lib/books");
var topics = require("./lib/topics");

app.set("port", process.env.PORT || 3000);

async.parallel(
  [
    function (asyncCallback) {
      books.loadAll("./content/books", asyncCallback);
    },
    function (asyncCallback) {
      topics.loadAll("./content/topics", asyncCallback);
    },
    function (asyncCallback) {
      app.listen(
        app.get("port"),
        function () {
          console.log("Server listening on", app.get("port"));
          return asyncCallback();
        }
      );
    }
  ],
  function (err) {
    if(err) {
      throw err;
    }

    console.log("App ready.");
  }
);
