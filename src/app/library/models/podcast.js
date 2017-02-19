import DataType from 'sequelize'
import Episode from './episode'
import Model from '../sequelize'

var FeedParser = require('feedparser')
var request = require('request')
var Promise = require('bluebird')

const Podcast = Model.define('Podcast', {
  id: {
    type: DataType.INTEGER, 
    field: "id",             
    autoIncrement: !0,       
    primaryKey: !0
  },
  title: { type: DataType.STRING, defaultValue: '' },
  feed: { type: DataType.STRING, defaultValue: '' },
  description: { type: DataType.STRING, defaultValue: '' },
  link: { type: DataType.STRING, defaultValue: '' },
  author: { type: DataType.STRING, defaultValue: '' },
  pubDate: { type: DataType.DATE, field: 'pub_date', defaultValue: DataType.NOW },
  language: { type: DataType.STRING, defaultValue: '' },
  copyright: { type: DataType.STRING, defaultValue: '' },
  imageUrl: { type: DataType.STRING, field: 'image_url', defaultValue: '' },
  imageBlob: { type: DataType.BLOB, field: 'image_blob', defaultValue: '' },
  lastParsed: { type: DataType.DATE, field: 'last_parsed', defaultValue: DataType.NOW }
}, {
  tableName: 'podcasts',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true,
  classMethods: {
    subscribe: function(url) {
      return new Promise(function(resolve, reject) {
        Podcast.create({
          feed: url
        })
        .then(function(podcast) {
          return podcast.reload()
        })
        .then(resolve)
      })
    }
  },
  instanceMethods: {
    /*
    ** Fetches latest version of the feed, stores podcast changes then callback(podcast, [episodes])
    */
    reload: function() {
      const podcast = this

      return new Promise(function(resolve, reject) {
        const req = request(podcast.feed)
        const feedparser = new FeedParser()

        var meta = {}
        var episodes = []

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

        feedparser.on('meta', function (parsed) {
          meta = parsed
        })

        feedparser.on('readable', function () {
          const stream = this
          const meta = this.meta

          var item
          while (item = stream.read()) {
            episodes.push(item)
          }
        })

        feedparser.on('finish', function() {
          podcast.update({
            title: meta.title,
            description: meta.description,
            link: meta.link,
            author: meta.author,
            pubDate: meta.pubDate,
            language: meta.language,
            copyright: meta.copyright,
            imageUrl: meta.image.url,
            lastParsed: new Date()
            //categories: meta.categories
          })
          .then((saved) => {
            Promise.map(episodes, function(episode) {
              return Episode.updateParsedEpisode(podcast, episode) 
            }, {concurrency: 10})
            .then(saved.reloadImage())
            .then(resolve)
          })
        })
      })
    },

    reloadImage: function() {
      const podcast = this

      return new Promise(function(resolve, reject) {
        request(podcast.imageUrl, (err, resp, body) => {
          if (err) {
            reject(err)
          } else {
            podcast.update({
              imageBlob: new Buffer(body)
            }).then(resolve)
          }
        })
      })
    }
  }
})

Podcast.hasMany(Episode, { foreignKey: 'podcast_id' })

export { Podcast, Episode }

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