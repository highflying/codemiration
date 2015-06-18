var loader = require("./loader");

module.exports = {
  findFiles: loader.findFiles,
  load:      loader.load,
  loadAll:   loadAll,
  get:       get,
  getAll:    getAll,
};

var topicCache = {};

function loadAll(path, callback) {
  loader.loadAll(
    path,
    topicCache,
    callback
  );
}

function get(id) {
  return topicCache[id];
}

function getAll() {
  return topicCache;
}
