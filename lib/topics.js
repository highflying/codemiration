var fs    = require("fs");
var path  = require("path");
var async = require("async");

module.exports = {
  findFiles: findFiles,
  load:      load,
  loadAll:   loadAll,
  get:       get,
  getAll:    getAll,
};

var topicCache = {};

function findFiles(path, callback) {
  if(path.substr(path.length - 1, 1) !== "/") {
    path += "/";
  }

  return fs.readdir(
    path,
    function (err, files) {
      if(err) {
        return callback(err);
      }

      files = files.map(function (filename) { return path + filename; });

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
            function (err, topic) {
              if(err) {
                // TODO log error somewhere
                // console.error(err);
                return asyncCallback();
              }

              return asyncCallback(null, topic);
            }
          );
        },
        function (err, results) {
          topicCache = {};

          results
            .filter(function (topic) { return topic ? true : false; })
            .forEach(function (topic) { topicCache[topic.id] = topic; });

          return callback(null, topicCache);
        }
      );
    }
  );
}

function get(id) {
  return topicCache[id];
}

function getAll() {
  return topicCache;
}
