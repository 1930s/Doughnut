var FeedParser = require('feedparser')
var request = require('request')

import Episode from './episode'

export default class Podcast {
  constructor(data) {
    this.title = data.title
    this.feed = data.feed
    this.meta = data.meta

    if (data.imageBuffer) {
      this.imageBuffer = data.imageBuffer
    } else {
      this.imageBuffer = new Buffer(0)
    }

    if (data.episodes) {
      data.episodes.map((e) => {
        return new Episode(e)
      })
    } else {
      this.episodes = []
    }
  }

  // Return data to store
  store() {
    return {
      title: this.meta.title,
      feed: this.feed,
      meta: this.meta,
      imageBuffer: this.imageBuffer.toString('base64'),
      episodes: this.episodes.map((e) => {
        return e.data()
      })
    }
  }

  static subscribe(url, loaded) {
    const podcast = new Podcast({
      feed: url
    })

    podcast.reload((err) => {
      loaded(err, podcast)
    })
  }

  reload(loaded) {
    const podcast = this
    const req = request(this.feed)
    const feedparser = new FeedParser()

    req.on('error', function (error) {
      console.log("Error: ", error)
    });

    req.on('response', function (res) {
      var stream = this; // `this` is `req`, which is a stream

      if (res.statusCode !== 200) {
        console.log('Bad status code')
      } else {
        stream.pipe(feedparser)
      }
    })

    feedparser.on('meta', function (meta) {
      podcast.parsePodcast(meta)
    })

    feedparser.on('readable', function () {
      const stream = this
      const meta = this.meta

      var item
      while (item = stream.read()) {
        podcast.parseEpisode(item)
      }
    })

    feedparser.on('finish', function() {
      podcast.reloadImage(() => {
        loaded(podcast)
      })
    })
  }

  reloadImage(callback) {
    const podcast = this

    console.log(this.meta.image.url)
    request(this.meta.image.url, (err, resp, body) => {
      if (err) {

      } else {
        podcast.imageBuffer = new Buffer(body)

        callback()
      }
    })
  }

  parsePodcast(meta) {
    this.meta = Object.assign({}, this.meta, {
      title: meta.title,
      description: meta.description,
      date: meta.date,
      language: meta.language,
      copyright: meta.copyright,
      categories: meta.categories,
      image: {
        url: meta.image.url,
        title: meta.image.title,
        link: meta.image.link
      }
    })
  }

  parseEpisode() {
    
  }
}