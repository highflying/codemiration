/* global describe, it */

var tests = require('../test-helpers');
var expect = tests.expect;
var topics = require('lib/topics');

var topicId = 'topic';
var topicPath = tests.fixturePath + 'topics/';
var badTopicPath = tests.fixturePath + 'bad-topics/';

describe('topics', function () {
  describe('findFiles()', function () {
    it('should find all topics in a given path', function (done) {
      expect(topics).to.respondTo('findFiles');

      topics.findFiles(badTopicPath, function (err, fileList) {
        expect(err).to.be.null();
        expect(fileList).to.be.an('array');
        expect(fileList).to.deep.equal([
          badTopicPath + '1invalid-json-topic.json',
          badTopicPath + topicId + '.json'
        ]);

        done();
      });
    });

    it('should error on an invalid path', function (done) {
      topics.findFiles(
        'made up path',
        function (err, fileList) {
          expect(err).to.be.an.instanceOf(Error);
          expect(fileList).to.be.undefined();

          return done();
        }
      );
    });
  });

  describe('load()', function () {
    it('should read valid json file', function (done) {
      expect(topics).to.respondTo('load');

      topics.load(topicPath + topicId + '.json', function (err, topicData) {
        expect(err).to.be.null();
        expect(topicData).to.be.an('object');

        expect(topicData.title).to.be.a('string');
        expect(topicData.summary).to.be.a('string');
        expect(topicData.rationale).to.be.an('array');
        expect(topicData.references).to.be.a('array');

        done();
      });
    });

    it('should error on a missing file', function (done) {
      topics.load('made-up-filename.json', function (err, topicData) {
        expect(topicData).to.be.undefined();
        expect(err).to.be.an.instanceOf(Error);

        done();
      });
    });

    it('should error on invalid json', function (done) {
      topics.load(topicPath + '1invalid-json-topic.json', function (err, topicData) {
        expect(topicData).to.be.undefined();
        expect(err).to.be.an.instanceOf(Error);

        done();
      });
    });
  });

  describe('loadAll()', function () {
    it('should load all available topics', function (done) {
      expect(topics).to.respondTo('loadAll');

      topics.load(
        topicPath + topicId + '.json',
        function (err, topicData) {
          expect(err).to.be.null();

          topics.loadAll(
            topicPath,
            function (err, allTopics) {
              expect(err).to.be.null();

              expect(allTopics).to.be.an('object');
              expect(Object.keys(allTopics)).to.have.length(1);
              expect(allTopics).to.have.property(topicId);
              expect(allTopics[topicId]).to.deep.equal(topicData);
              done();
            }
          );
        }
      );
    });

    it('should error on an invalid path', function (done) {
      topics.loadAll(
        'made up path',
        function (err, allTopics) {
          expect(err).to.be.an.instanceOf(Error);
          expect(allTopics).to.be.undefined();

          return done();
        }
      );
    });
  });

  describe('get()', function () {
    it('should return a single topic by id', function (done) {
      expect(topics).to.respondTo('get');

      topics.load(
        topicPath + topicId + '.json',
        function (err, expectedData) {
          expect(err).to.be.null();

          var topicData = topics.get(topicId);
          expect(topicData).to.be.an('object');
          expect(topicData).to.deep.equal(expectedData);

          done();
        }
      );
    });

    it('should handle unknown ids', function () {
      var topicData = topics.get('made-up-id');

      expect(topicData).to.be.undefined();
    });
  });

  describe('getAll', function () {
    it('should return all topics', function (done) {
      expect(topics).to.respondTo('getAll');

      topics.loadAll(
        topicPath,
        function (err, expectedTopics) {
          expect(err).to.be.null();

          var allTopics = topics.getAll();
          expect(allTopics).to.be.an('object');
          expect(allTopics).to.deep.equal(expectedTopics);

          done();
        }
      );
    });
  });
});
