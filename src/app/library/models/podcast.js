import DataType from 'sequelize'
import Model from '../sequelize'

var FeedParser = require('feedparser')
var request = require('request')

const Podcast = Model.define('Podcast', {
  id: {
    type: DataType.INTEGER, 
    field: "id",             
    autoIncrement: !0,       
    primaryKey: !0
  },
  title: { type: DataType.STRING },
  feed: { type: DataType.STRING },
  description: { type: DataType.STRING },
  link: { type: DataType.STRING },
  author: { type: DataType.STRING },
  pubDate: { type: DataType.DATE, field: 'pub_date' },
  language: { type: DataType.STRING },
  copyright: { type: DataType.STRING },
  imageUrl: { type: DataType.STRING, field: 'image_url' },
  imageBlob: { type: DataType.TEXT, field: 'image_blob' },
  lastParsed: { type: DataType.DATE, field: 'last_parsed' }
}, {
  tableName: 'podcasts',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true,
  classMethods: {
    subscribe: function(url, callback) {
      const podcast = Podcast.create({
        title: "Test",
        feed: url
      }).then(callback)
/*
      podcast.reload((err) => {
        loaded(err, podcast)
      })*/
    }
  },
  instanceMethods: {

  }
})

export default Podcast

/*
PodcastCategory = Sequelize.define('podcast_category', {})

Podcast.belongsToMany(Category, { through: PodcastCategory })

Podcast.subscribe = (url, loaded) => {
  const podcast = Podcast.build({
    feed: url
  })

  podcast.reload((err) => {
    loaded(err, podcast)
  })
}

Podcast.prototype.reload = (callback) => {
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

Podcast.prototype.reloadImage = (callback) => {
  const podcast = this

  console.log(this.image_url)
  request(this.image_url, (err, resp, body) => {
    if (err) {

    } else {
      podcast.image_blob = new Buffer(body).toString('base64')
      callback()
    }
  })
}

Podcast.prototype.parsePodcast = (meta) => {
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

module.exports = Podcast
/*
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

  

  

  parseEpisode() {
    
  }
}*/