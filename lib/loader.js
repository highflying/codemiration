var fs = require('fs');
var path = require('path');
var async = require('async');

module.exports = {
  findFiles: findFiles,
  load: load,
  loadAll: loadAll
};

function findFiles (path, callback) {
  if (path.substr(path.length - 1, 1) !== '/') {
    path += '/';
  }

  return fs.readdir(
    path,
    function (err, files) {
      if (err) {
        return callback(err);
      }

      files = files.map(function (filename) { return path + filename; });

      return callback(null, files);
    }
  );
}

function load (filename, callback) {
  return fs.readFile(
    filename,
    function (err, data) {
      if (err) {
        return callback(err);
      }

      var parsedJSON;
      try {
        parsedJSON = JSON.parse(data);
      } catch (caughtErr) {
        return callback(caughtErr);
      }

      parsedJSON.id = path.basename(filename, '.json');

      return callback(null, parsedJSON);
    }
  );
}

function loadAll (path, cache, callback) {
  findFiles(
    path,
    function (err, files) {
      if (err) {
        return callback(err);
      }

      async.map(
        files,
        function (filename, asyncCallback) {
          return load(
            filename,
            asyncCallback
          );
        },
        function (err, results) {
          if (err) {
            throw err;
          }

          results
            .filter(function (entry) { return entry; })
            .forEach(function (entry) { cache[entry.id] = entry; });

          return callback(null, cache);
        }
      );
    }
  );
}
