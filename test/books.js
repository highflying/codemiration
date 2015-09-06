var tests  = require("../test-helpers");
var expect = tests.expect;
var books  = require("lib/books");

var bookId    = "book";
var booksPath = tests.fixturePath + "books/";

describe("books", function () {
  describe("findFiles()", function () {
    it("should find all books in a given path", function (done) {
      expect(books).to.respondTo("findFiles");

      books.findFiles(booksPath, function (err, fileList) {
        expect(err).to.be.null();
        expect(fileList).to.be.an("array");
        expect(fileList).to.deep.equal([
          booksPath + "1invalid-json-book.json",
          booksPath + bookId + ".json",
        ]);

        done();
      });
    });

    it("should error on an invalid path", function (done) {
      books.findFiles(
        "made up path",
        function (err, fileList) {
          expect(err).to.be.an.instanceOf(Error);
          expect(fileList).to.be.undefined();

          return done();
        }
      );
    });
  });

  describe("load()", function () {

    it("should read valid json file", function (done) {
      expect(books).to.respondTo("load");

      books.load(booksPath + bookId + ".json", function (err, bookData) {
        expect(err).to.be.null();
        expect(bookData).to.be.an("object");

        expect(bookData.id).to.equal(bookId);
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
      books.load("made-up-filename.json", function (err, bookData) {
        expect(bookData).to.be.undefined();
        expect(err).to.be.an.instanceOf(Error);

        done();
      });
    });

    it("should error on invalid json", function (done) {
      books.load(booksPath + "1invalid-json-book.json", function (err, bookData) {
        expect(bookData).to.be.undefined();
        expect(err).to.be.an.instanceOf(Error);

        done();
      });
    });
  });

  describe("loadAll()", function () {
    it("should load all available books", function (done) {
      expect(books).to.respondTo("loadAll");

      books.load(
        booksPath + bookId + ".json",
        function (err, bookData) {
          books.loadAll(
            booksPath,
            function (err, allBooks) {
              expect(allBooks).to.be.an("object");
              expect(Object.keys(allBooks)).to.have.length(1);
              expect(allBooks).to.have.property(bookId);
              expect(allBooks[bookId]).to.deep.equal(bookData);
              done();
            }
          );
        }
      );
    });

    it("should error on an invalid path", function (done) {
      books.loadAll(
        "made up path",
        function (err, allBooks) {
          expect(err).to.be.an.instanceOf(Error);
          expect(allBooks).to.be.undefined();

          return done();
        }
      );
    });
  });

  describe("get()", function () {
    it("should return a single book by id", function (done) {
      expect(books).to.respondTo("get");

      books.load(
        booksPath + bookId + ".json",
        function (err, expectedData) {
          var bookData = books.get(bookId);
          expect(bookData).to.be.an("object");
          expect(bookData).to.deep.equal(expectedData);

          done();
        }
      );
    });

    it("should handle unknown ids", function () {
      var bookData = books.get("made-up-id");

      expect(bookData).to.be.undefined();
    });
  });

});
