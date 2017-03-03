import DataType from 'sequelize'
import Model from '../sequelize'

var Promise = require('bluebird')
var FeedParser = require('feedparser')
var request = require('request')
var path = require('path')
var sanitize = require("sanitize-filename")

const Episode = Model.define('Episode', {
  id: {
    type: DataType.INTEGER, 
    field: "id",             
    autoIncrement: !0,       
    primaryKey: !0
  },
  podcast_id: { type: DataType.INTEGER },
  title: { type: DataType.STRING, defaultValue: '' },
  description: { type: DataType.STRING, defaultValue: '' },
  guid: { type: DataType.STRING, defaultValue: '' },
  pubDate: { type: DataType.DATE, field: 'pub_date', defaultValue: DataType.NOW },
  link: { type: DataType.STRING, defaultValue: '' },
  enclosureUrl: { type: DataType.STRING, field: 'enclosure_url', defaultValue: '' },
  enclosureSize: { type: DataType.INTEGER, field: 'enclosure_size', defaultValue: 0 },
  favourite: { type: DataType.BOOLEAN, defaultValue: false },
  downloaded: { type: DataType.BOOLEAN, defaultValue: false }
}, {
  tableName: 'episodes',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true,
  classMethods: {
    /*
    ** Find an existing episode or create a new one
    */
    updateParsedEpisode: function(podcast, data) {
      return new Promise(function(resolve, reject) {
        Episode.findAll({
          where: {
            podcast_id: podcast.id,
            $or: [
              { guid: data.guid },
              { title: data.title }
            ]
          }
        })
        .then((episodes) => {
          if (!episodes || episodes.length == 0) {
            // Episode is new, create it
            Episode.create(Object.assign({}, 
              Episode.sanitizeMeta(data), {
              podcast_id: podcast.id,
            })).then(resolve)
          } else {
            resolve(false)
          }
        })
        .catch(reject)
      })
    },

    sanitizeMeta: function(data) {
      var enclosure = {}
      if (data.enclosures && data.enclosures.length > 0) {
        enclosure = data.enclosures[0]
      }

      return {
        title: data.title,
        description: data.description,
        guid: data.guid,
        pubDate: data.pubDate,
        link: data.link,
        enclosureUrl: enclosure.url,
        enclosureSize: enclosure.length
      }
    }
  },
  instanceMethods: {
    viewJson: function() {
      return Object.assign({}, this.toJSON(), {
      })
    },

    fileName: function() {
      const ext = path.extname(this.enclosureUrl)
      return `${sanitize(this.title)}${ext}`
    }
  }
})

export default Episode