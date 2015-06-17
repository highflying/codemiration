var fs    = require("fs");
var path  = require("path");
var async = require("async");

module.exports = {
  findFiles: findFiles,
  load:      load,
  loadAll:   loadAll,
  get:       get,
};

var bookCache = {};

function findFiles(path, callback) {
  return fs.readdir(
    path,
    function (err, files) {
      if(err) {
        return callback(err);
      }

      files = files.map(function (filename) { return path + "/" + filename; });

      return callback(null, files);
    }
  );
}

function load(filename, callback) {
  return fs.readFile(
    filename,
    function (err, data) {
      if(err) {
        return callback(err);
      }

      var parsedJSON;
      try {
        parsedJSON = JSON.parse(data);
      }
      catch(caughtErr) {
        return callback(caughtErr);
      }


      parsedJSON.id = path.basename(filename, ".json");

      return callback(null, parsedJSON);
    }
  );
}

function loadAll(path, callback) {
  findFiles(
    path,
    function (err, files) {
      if(err) {
        return callback(err);
      }

      async.map(
        files,
        function (filename, asyncCallback) {
          return load(
            filename,
            function (err, book) {
              if(err) {
                // TODO log error somewhere
                return asyncCallback();
              }

              return asyncCallback(null, book);
            }
          );
        },
        function (err, results) {
          bookCache = {};

          results
            .filter(function (book) { return book ? true : false; })
            .forEach(function (book) { bookCache[book.id] = book; });

          return callback(null, bookCache);
        }
      );
    }
  );
}

function get(id) {
  return bookCache[id];
}
