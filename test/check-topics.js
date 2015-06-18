var tests  = require("../test-helpers");
var expect = tests.expect;
var topics = require("../lib/topics.js");
var jjv    = require("jjv");
var fs     = require("fs");

var topicsPath = "content/topics/";

describe("check topics", function () {

  var topicSchemaText = fs.readFileSync("schemas/topic.json", {encoding: "utf8"});
  expect(topicSchemaText).to.be.a("string");
  var topicSchema = JSON.parse(topicSchemaText);
  expect(topicSchema).to.be.an("object");

  var env = jjv();
  env.addSchema("topic", topicSchema);

  var fileList = fs.readdirSync(topicsPath);

  fileList.forEach(
    function (file) {
      it("validate " + file, function (done) {
        topics.load(
          topicsPath + file,
          function (err, topicData) {
            expect(err).to.be.null();
            expect(topicData).to.be.an("object");

            var errors = env.validate("topic", topicData);

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
