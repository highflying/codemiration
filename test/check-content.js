/* global describe, it */

var tests = require('../test-helpers');
var expect = tests.expect;
var jjv = require('jjv');
var fs = require('fs');

var books = require('lib/books');
var topics = require('lib/topics');

describe('check topics', function () {
  validate('topic', 'content/topics/', topics.load);
});

describe('check books', function () {
  validate('book', 'content/books/', books.load);
});

function validate (schemaName, path, loader) {
  var schemaText = fs.readFileSync('schemas/' + schemaName + '.json', {encoding: 'utf8'});
  expect(schemaText).to.be.a('string');
  var schema = JSON.parse(schemaText);
  expect(schema).to.be.an('object');

  var env = jjv();
  env.addSchema(schemaName, schema);

  var fileList = fs.readdirSync(path);

  fileList.forEach(
    function (file) {
      it('validate ' + file, function (done) {
        loader(
          path + file,
          function (err, data) {
            expect(err).to.be.null();
            expect(data).to.be.an('object');

            var errors = env.validate(schemaName, data);

            if (errors) {
              throw new Error(JSON.stringify(errors));
            }

            expect(errors).to.be.null();

            return done();
          }
        );
      });
    }
  );
}
