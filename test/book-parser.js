var expect     = require("chai").expect;
var bookParser = require("../lib/book-parser.js");

var fixturePath = __dirname + "/../test-fixtures/";

describe("book-parser", function () {

  it("should read valid json file", function (done) {
    expect(bookParser).to.be.a("function");

    bookParser(fixturePath + "book.json", function (err, bookData) {
      expect(err).to.be.a("null");
      expect(bookData).to.be.an("object");

      expect(bookData.title).to.be.a("string");
      expect(bookData.subtitle).to.be.a("string");
      expect(bookData.author).to.be.an("array");
      expect(bookData.publisher).to.be.a("string");
      expect(bookData.year).to.be.a("number");
      expect(bookData.isbn).to.be.a("string");

      expect(bookData.title).to.equal("Essential Skills for the Agile Developer");
      expect(bookData.subtitle).to.equal("A Guide to Better Programming and Design");
      expect(bookData.author).to.deep.equal(["Alan Shalloway", "Scott Bain", "Ken Pugh", "Amir Kolsky"]);
      expect(bookData.publisher).to.equal("Addison-Wesley");
      expect(bookData.year).to.equal(2011);
      expect(bookData.isbn).to.equal("9780321543738");
      
      done();
    });
  });

  it("should error on a missing file", function (done) {
    bookParser("made-up-filename.json", function (err, bookData) {
      expect(bookData).to.be.a("undefined");
      expect(err).to.be.an.instanceOf(Error);

      done();
    });
  });

  it("should error on invalid json", function (done) {
    bookParser(fixturePath + "invalid-json-book.json", function (err, bookData) {
      expect(bookData).to.be.an("undefined");

      done();
    });
  });
});
