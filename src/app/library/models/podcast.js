/*
 * Doughnut Podcast Client
 * Copyright (C) 2017 Chris Dyer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import DataType from 'sequelize'
import Episode from './episode'
import Category from './category'
import Model from '../sequelize'
import Settings from '../../settings'

var FeedParser = require('feedparser')
var request = require('request')
var Promise = require('bluebird')
var path = require('path')
var sanitize = require('sanitize-filename')
var fs = require('fs')

const Podcast = Model.define('Podcast', {
  id: {
    type: DataType.INTEGER,
    field: 'id',
    autoIncrement: true,
    primaryKey: true
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
  lastParsed: { type: DataType.DATE, field: 'last_parsed', defaultValue: DataType.NOW },
  downloadNew: { type: DataType.BOOLEAN, field: 'download_new', defaultValue: true },
  deletePlayed: { type: DataType.BOOLEAN, field: 'delete_played', defaultValue: true }
}, {
  tableName: 'podcasts',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true,
  defaultScope: {
    include: [ Category ]
  },
  classMethods: {
    subscribe: function (url) {
      return new Promise(function (resolve, reject) {
        var parsed = {}

        Podcast.parseFeed(url)
          .then(result => {
            parsed = result
            const meta = Podcast.sanitizeMeta(parsed.meta)
            return Podcast.create(meta)
          })
          .then(podcast => {
            const categoryNames = Podcast.sanitizeCategories(parsed.meta)
            return podcast.linkCategories(categoryNames)
          })
          .then(function (podcast) {
            return podcast.syncFeed()
          })
          .then(resolve)
          .catch(reject)
      })
    },

    parseFeed: function (feed) {
      return new Promise((resolve, reject) => {
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
          for (var item = feedparser.read(); item != null; item = feedparser.read()) {
            items.push(item)
          }
          return items
        })

        request.get(feed)
          .on('error', (err) => { reject(err) })
          .pipe(feedparser)
          .on('end', () => {
            return resolve({
              meta: Object.assign({}, meta, { feed: feed }),
              items: items
            })
          })
      })
    },

    // Take raw feed meta and return podcast attributes
    sanitizeMeta: function (meta) {
      var author = meta['author']
      if (meta['itunes:author'] && meta['itunes:author']['#']) {
        author = meta['itunes:author']['#']
      }

      var imageUrl = meta.image.url
      if (meta['itunes:image'] && meta['itunes:image']['@'] && meta['itunes:image']['@']['href']) {
        imageUrl = meta['itunes:image']['@']['href']
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
        imageUrl: imageUrl,
        lastParsed: new Date()
      }
    },

    sanitizeCategories: function (meta) {
      var categories = []
      if (meta['itunes:category']) {
        for (var i = 0; i < meta['itunes:category'].length; i++) {
          var at = meta['itunes:category'][i]['@']
          if (at && at.text) {
            categories.push(
              at.text.replace(/&amp;/g, '&')
            )
          }
        }
      }

      return categories
    }
  },
  instanceMethods: {
    storagePath: function () {
      const podcastPath = path.join(Settings.get('libraryPath'), sanitize(this.title))
      if (!fs.existsSync(podcastPath)) {
        fs.mkdirSync(podcastPath)
      }

      return podcastPath
    },

    fileName: function (episode) {
      return path.join(this.storagePath(), episode.fileName())
    },

    artworkFile: function () {
      var imageExtension = path.extname(this.imageUrl)
      return path.join(this.storagePath(), `Artwork${imageExtension}`)
    },

    /*
    ** Fetches latest version of the feed, stores podcast changes then resolve({podcast, newEpisodes})
    */
    syncFeed: function (cb = () => {}) {
      const podcast = this

      return new Promise((resolve, reject) => {
        var foundEpisodes = []

        Episode.findAll({
          attributes: ['id'],
          where: { podcast_id: podcast.id }
        })
        .then(existingEpisodes => {
          var parsed = {}

          Podcast.parseFeed(podcast.feed)
            .then(result => {
              parsed = result
              const meta = Podcast.sanitizeMeta(parsed.meta)

              return Promise.map(parsed.items, episode => {
                return Episode.updateParsedEpisode(podcast, episode)
              }, {concurrency: 10})
                .then(episodes => {
                  foundEpisodes = episodes.filter(e => {
                    return !existingEpisodes.find(existEp => {
                      return existEp.id === e.id
                    })
                  })
                  return podcast.update(meta)
                })
                .catch(reject)
            })
            .then(podcast => {
              const categoryNames = Podcast.sanitizeCategories(parsed.meta)
              return podcast.linkCategories(categoryNames)
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
      })
    },

    reloadImage: function () {
      const podcast = this

      return new Promise(function (resolve, reject) {
        request({
          url: podcast.imageUrl,
          encoding: null
        }, (err, response, data) => {
          if (err != null) {
            reject(err)
          } else {
            if (response.statusCode === 200) {
              fs.writeFile(podcast.artworkFile(), data, (err) => {
                if (err != null) {
                  reject(err)
                } else {
                  resolve(podcast)
                }
              })
            } else {
              resolve(podcast)
            }
          }
        })
      })
    },

    linkCategories: function (categoryNames) {
      const podcast = this

      return new Promise(function (resolve, reject) {
        Promise.map(categoryNames, name => {
          return Category.findOrCreateWithName(name)
        })
        .then(categories => {
          podcast.setCategories(categories)
            .then(() => {
              Podcast.findById(podcast.id)
                .then(resolve)
                .catch(reject)
            })
            .catch(reject)
        })
        .catch(reject)
      })
    },

    viewJson: function () {
      var categories = []
      if (this.Categories) {
        categories = this.Categories.map(c => {
          return c.name
        })
      }

      return {
        id: this.id,
        title: this.title,
        feed: this.feed,
        description: this.description,
        link: this.link,
        author: this.author || '',
        pubDate: this.pubDate || (new Date()),
        language: this.language || 'en',
        copyright: this.copyright || '',
        categories: categories,
        imageUrl: this.imageUrl,
        lastParsed: this.lastParsed,
        downloadNew: this.downloadNew,
        deletePlayed: this.deletePlayed,
        created_at: this.created_at,
        updated_at: this.updated_at
      }
    }
  }
})

Podcast.hasMany(Episode, {
  foreignKey: 'podcast_id'
})
Episode.belongsTo(Podcast, {
  foreignKey: 'podcast_id'
})

Category.belongsToMany(Podcast, {
  through: 'podcast_categories',
  foreignKey: 'category_id',
  timestamps: false
})

Podcast.belongsToMany(Category, {
  through: 'podcast_categories',
  foreignKey: 'podcast_id',
  timestamps: false
})

export { Podcast, Episode, Category }
