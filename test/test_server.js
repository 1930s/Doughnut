var express = require('express')
var RSS = require('rss')
var app = express()
var path = require('path')

const podcast = require('./fixtures/podcast.js')

app.get('/feed.xml', function (req, res) {
  const feed = new RSS(podcast.feed)
  const items = req.query.items || 1

  for (var i = 0; i < podcast.items.length && i < items; i++) {
    feed.item(podcast.items[i])
  }

  res.set('Content-Type', 'text/xml');
  res.send(feed.xml());
})

app.get('/image.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, '/fixtures/image.jpg'))
})

app.get('/enclosure.mp3', function(req, res) {
  res.sendFile(path.join(__dirname, '/fixtures/enclosure.mp3'))
})

app.listen(3000, function () {
  console.log('Test podcast listening on port 3000')
})

module.exports