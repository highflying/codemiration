var expect = require("chai").expect;
var topics = require("../lib/topics.js");

var fixturePath = __dirname + "/../test-fixtures/";

describe("topics", function () {
  describe("findFiles()", function () {
    it("should find all topics in a given path", function (done) {
      expect(topics).to.respondTo("findFiles");

      topics.findFiles(fixturePath + "topics", function (err, fileList) {
        expect(err).to.be.a("null");
        expect(fileList).to.be.an("array");
        expect(fileList).to.deep.equal([
          fixturePath + "topics/1invalid-json-topic.json",
          fixturePath + "topics/topic.json",
        ]);

        done();
      });
    });

    it("should error on an invalid path", function (done) {
      topics.findFiles(
        "made up path",
        function (err, fileList) {
          expect(err).to.be.an.instanceOf(Error);
          expect(fileList).to.be.undefined;

          return done();
        }
      );
    });
  });

  describe("load()", function () {

    it("should read valid json file", function (done) {
      expect(topics).to.respondTo("load");

      topics.load(fixturePath + "topics/topic.json", function (err, topicData) {
        expect(err).to.be.a("null");
        expect(topicData).to.be.an("object");

        expect(topicData.title).to.be.a("string");
        expect(topicData.summary).to.be.a("string");
        expect(topicData.rationale).to.be.an("array");
        expect(topicData.references).to.be.a("array");
        
        done();
      });
    });

    it("should error on a missing file", function (done) {
      topics.load("made-up-filename.json", function (err, topicData) {
        expect(topicData).to.be.a("undefined");
        expect(err).to.be.an.instanceOf(Error);

        done();
      });
    });

    it("should error on invalid json", function (done) {
      topics.load(fixturePath + "topics/1invalid-json-topic.json", function (err, topicData) {
        expect(topicData).to.be.an("undefined");
        expect(err).to.be.an.instanceOf(Error);

        done();
      });
    });
  });

  describe("loadAll()", function () {
    it("should load all available topics", function (done) {
      expect(topics).to.respondTo("loadAll");

      topics.load(
        fixturePath + "topics/topic.json",
        function (err, topicData) {
          topics.loadAll(
            fixturePath + "topics",
            function (err, allTopics) {
              expect(allTopics).to.be.an("object");
              expect(Object.keys(allTopics)).to.have.length(1);
              expect(allTopics).to.have.property("topic");
              expect(allTopics.topic).to.deep.equal(topicData);
              done();
            }
          );
        }
      );
    });

    it("should error on an invalid path", function (done) {
      topics.loadAll(
        "made up path",
        function (err, allTopics) {
          expect(err).to.be.an.instanceOf(Error);
          expect(allTopics).to.be.undefined;

          return done();
        }
      );
    });
  });

  describe("get()", function () {
    it("should return a single topic by id", function (done) {
      expect(topics).to.respondTo("get");

      topics.load(
        fixturePath + "topics/topic.json",
        function (err, expectedData) {
          var topicData = topics.get("topic");
          expect(topicData).to.be.an("object");
          expect(topicData).to.deep.equal(expectedData);

          done();
        }
      );
    });

    it("should handle unknown ids", function () {
      var topicData = topics.get("made-up-id");

      expect(topicData).to.be.undefined;
    });
  });

  describe("getAll", function () {
    it("should return all topics", function (done) {
      expect(topics).to.respondTo("getAll");

      topics.loadAll(
        fixturePath + "topics",
        function (err, expectedTopics) {
          var allTopics = topics.getAll();
          expect(allTopics).to.be.an("object");
          expect(allTopics).to.deep.equal(expectedTopics);

          done();
        }
      );
    });
  });
});
