import DataType from 'sequelize'
import Episode from './episode'
import Model from '../sequelize'

const moment = require('moment')
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
  lastParsed: { type: DataType.DATE, field: 'last_parsed', defaultValue: DataType.NOW },
  downloadNew: { type: DataType.BOOLEAN, field: 'download_new', defaultValue: true },
  deletePlayed: { type: DataType.BOOLEAN, field: 'delete_played', defaultValue: true }
}, {
  tableName: 'podcasts',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true,
  classMethods: {
    subscribe: function(url) {
      return new Promise(function(resolve, reject) {
        Podcast.parseFeed(url)
          .then(parsed => {
            const meta = Podcast.sanitizeMeta(parsed.meta)
            return Podcast.create(meta)
          })
          .then(function(podcast) {
            return podcast.syncFeed()
          })
          .then(resolve)
          .catch(reject)
      })
    },

    parseFeed: function(feed) {
      return new Promise( (resolve, reject) => {
        var meta = {}
        const items = []
        const feedparser = new FeedParser()

        feedparser.on('error', (err) => {
          reject(err)
        })

        feedparser.on('meta', function (parsed) {
          meta = parsed
        })

        feedparser.on('readable', () => {
          let item
          while(item = feedparser.read()) { items.push(item); }
          return items
        })

        request.get(feed)
          .on('error', (err) => { reject(err); })
          .pipe(feedparser)
          .on('end', () => {
            return resolve({
              meta: Object.assign({}, meta, { feed: feed }),
              items: items
            });
          })
      })
    },

    // Take raw feed meta and return podcast attributes
    sanitizeMeta: function(meta) {
      var author = meta['author']
      if (meta['itunes:author'] && meta['itunes:author']['#']) {
        author = meta['itunes:author']['#']
      }

      return {
        title: meta.title,
        feed: meta.feed,
        description: meta.description,
        link: meta.link,
        author: author,
        pubDate: meta.pubDate,
        language: meta.language,
        copyright: meta.copyright,
        imageUrl: meta.image.url,
        lastParsed: new Date()
      }
    }
  },
  instanceMethods: {
    /*
    ** Fetches latest version of the feed, stores podcast changes then resolve({podcast, newEpisodes})
    */
    syncFeed: function(cb = () => {}) {
      const podcast = this

      return new Promise((resolve, reject) => {
        var foundEpisodes = []

        Podcast.parseFeed(podcast.feed)
          .then(parsed => {
            const meta = Podcast.sanitizeMeta(parsed.meta)
            
            return Promise.map(parsed.items, episode => {
              return Episode.updateParsedEpisode(podcast, episode) 
            }, {concurrency: 10})
              .then((episodes) => {
                foundEpisodes = episodes.filter((e) => { return e != false; })
                return podcast.update(meta)
              })
              .catch(reject)
          })
          .then(podcast => {
            return podcast.reloadImage()
          })
          .then(podcast => {
            resolve({
              podcast,
              found: foundEpisodes
            })
          })
          .catch(reject)
      })
    },

    newlyEpisodes: function(created) {
      return Episode.findAll({
        where: {
          podcast_id: this.id,
          new: true
        }
      })
    },

    reloadImage: function() {
      const podcast = this

      return new Promise(function(resolve, reject) {
        request({
          url: podcast.imageUrl,
          encoding: null
        }, (err, resp, body) => {
          if (err) {
            console.log("Error: ", err)
            reject(err)
          } else {
            podcast.update({
              imageBlob: body
            })
            .then(resolve)
            .catch(reject)
          }
        })
      })
    },

    viewJson: function() {
      var json = this.toJSON()
      if (json.Episodes) { delete json.Episodes }

      return Object.assign({}, json, {
        imageBlob: this.imageBlob.toString('base64')
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