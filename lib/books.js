var loader = require("lib/loader");

module.exports = {
  findFiles: loader.findFiles,
  load:      loader.load,
  loadAll:   loadAll,
  get:       get,
};

var bookCache = {};

function loadAll(path, callback) {
  loader.loadAll(
    path,
    bookCache,
    callback
  );
}

function get(id) {
  return bookCache[id];
}
