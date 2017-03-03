var Umzug = require('umzug')
var path = require('path')
var fs = require('fs')
const { dialog } = require('electron')
const Promise = require('bluebird')

import Settings from '../settings'
import Migrations from './migrations'
import Sequelize from './sequelize'
import { Podcast, Episode } from './models'
import TaskManager from './tasks'

class LibraryManager {
  constructor() {
    this.loaded = false

    this.taskManager = new TaskManager()
  }

  load(loaded) {
    const library = this

    // Run migrations
    Migrations.migrate(Sequelize, () => {
      library.loaded = true
      loaded()
    })
  }

  path() {
    return Settings.get('libraryPath')
  }

  /*
  * Subscribe to podcast at feed url
  */
  subscribe(url) {
    if (!this.loaded) { throw 'Library not loaded' }

    return new Promise(function(resolve, reject) {
      var preSubscribe = new Date()

      Podcast.subscribe(url)
        .then(result => {
          return result.podcast
        })
        .then(resolve)
        .catch(reject)
    })
  }

  unsubscribe(podcast, opts) {
    const options = Object.assign({
      permanent: false
    }, opts)

    return new Promise((resolve, reject) => {
      Podcast.findById(podcast.id)
        .then(podcast => {
          podcast.destroy()
        })
        .then(() => {
          resolve(true)
        })
        .catch(reject)
    })
  }

  loadPodcast(id) {
    return new Promise((resolve, reject) => {
      Podcast.findOne({ id: id })
      .then(resolve)
      .catch(reject)
    })
  }

  reload(podcast) {
    return new Promise((resolve, reject) => {
      var preReload = new Date()

      Podcast.findById(podcast.id)
        .then(podcast => {
          return podcast.syncFeed()
        })
        .then(result => {
          if (result.found.length > 0 && result.podcast.downloadNew) {
            result.found.forEach(e => {
              library().downloadEpisode(e)
            })
          }
          return result.podcast
        })
        .then(resolve)
        .catch(reject)
    })
  }

  downloadEpisode(episode) {
    this.taskManager.download(episode)
  }

  processTasks() {
    this.taskManager.process()
  }

  podcasts(callback = () => {}) {
    if (!this.loaded) { throw 'Library not loaded' }

    Podcast.findAll().then((podcasts) => {
      callback(podcasts)
    })
  }
}

export default function library() {
  if (!global._library) {
    global._library = new LibraryManager()
  }
  
  return global._library;
}