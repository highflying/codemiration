require('app-module-path').addPath(__dirname);

var chai      = require("chai");
var dirtyChai = require("dirty-chai");

chai.use(dirtyChai);

module.exports = {
  fixturePath: __dirname + "/test-fixtures/",
  expect:      chai.expect,
};
