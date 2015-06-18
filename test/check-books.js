var tests  = require("../test-helpers");
var expect = tests.expect;
var books  = require("../lib/books.js");
var jjv    = require("jjv");
var fs     = require("fs");

var booksPath = "content/books/";

describe("check books", function () {

  var bookSchemaText = fs.readFileSync("schemas/book.json", {encoding: "utf8"});
  expect(bookSchemaText).to.be.a("string");
  var bookSchema = JSON.parse(bookSchemaText);
  expect(bookSchema).to.be.an("object");

  var env = jjv();
  env.addSchema("book", bookSchema);

  var fileList = fs.readdirSync(booksPath);

  fileList.forEach(
    function (file) {
      it("validate " + file, function (done) {
        books.load(
          booksPath + file,
          function (err, bookData) {
            expect(err).to.be.null();
            expect(bookData).to.be.an("object");

            var errors = env.validate("book", bookData);

            if(errors) {
              throw new Error(JSON.stringify(errors));
            }

            expect(errors).to.be.null();

            return done();
          }
        );
      });
    }
  );
});
