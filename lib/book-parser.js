var fs = require("fs");

module.exports = function (filename, callback) {
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

      return callback(null, parsedJSON);
    }
  );
};
 
