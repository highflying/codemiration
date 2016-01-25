var topics = require('lib/topics');
var books = require('lib/books');

module.exports = function (app) {
  app.get('/', frontPage);
  app.get('/topics/:topicId', topicPage);
};

function frontPage (req, res) {
  res.locals.topics = topics.getAll();

  return res.render('front-page.html');
}

function topicPage (req, res) {
  var topicId = req.params.topicId;
  res.locals.topic = topics.get(topicId);

  if (res.locals.topic.references) {
    res.locals.topic.references.forEach(
      function (reference) {
        reference.data = books.get(reference.book);
      }
    );
  }

  return res.render('topic.html');
}
