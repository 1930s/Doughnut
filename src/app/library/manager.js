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

export class LibraryManager {
  constructor() {
    this.loaded = false

    this.emitReceivers = []
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

  emitSubscribe(cb) {
    this.emitReceivers.push(cb)
  }

  emit(event, data) {
    this.emitReceivers.forEach(sub => {
      sub(event, data)
    })
  }

  emitFullPodcastState() {
    const library = this

    Podcast.findAll({ include: [ Episode ], order: [[ Episode, 'pubDate', 'DESC' ]] }).then(podcasts => {
      library.emit('podcasts:updated', podcasts.map(p => { return p.id }))
    })
    /*
    Podcast.findAll({ include: [ Episode ], order: [[ Episode, 'pubDate', 'DESC' ]] }).then((podcasts) => {
      var json = podcasts.map((p) => {
        const episodes = p.Episodes.map((e) => {
          return e.viewJson()
        })

        return Object.assign(p.viewJson(), {
          episodes: episodes
        })
      })
      library.emit('podcasts:state', json)
    })*/
  }

  emitPodcastState(podcast) {
    const library = this

    library.emit('podcasts:updated', [podcast.id])
/*
    Episode.findAll({ where: { podcast_id: podcast.id }, order: [['pubDate', 'DESC']]})
      .then(episodes => {
        library.emit('podcast:state', Object.assign(podcast.viewJson(), {
          episodes: episodes
        }))
      })*/
  }

  /*
  * Subscribe to podcast at feed url
  */
  subscribe(url) {
    if (!this.loaded) { throw 'Library not loaded' }
    const library = this

    return new Promise(function(resolve, reject) {
      var preSubscribe = new Date()

      Podcast.subscribe(url)
        .then(result => {
          // Emit
          if (result && result.podcast) {
            library.emitPodcastState(result.podcast)
          }
          return result.podcast
        })
        .then(resolve)
        .catch(reject)
    })
  }

  unsubscribe(podcast, opts) {
    const library = this
    const options = Object.assign({
      permanent: false
    }, opts)

    return new Promise((resolve, reject) => {
      Podcast.findById(podcast.id)
        .then(podcast => {
          return podcast.destroy()
        })
        .then(() => {
          library.emit('podcast:unsubscribed', { id: podcast.id })
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

  loadEpisode(id) {
    return new Promise((resolve, reject) => {
      Episode.findById(id)
      .then(resolve)
      .catch(reject)
    })
  }

  reload(podcast) {
    const library = this

    return new Promise((resolve, reject) => {
      var preReload = new Date()

      Podcast.findById(podcast.id)
        .then(podcast => {
          return podcast.syncFeed()
        })
        .then(result => {
          library.emitPodcastState(result.podcast)

          if (result.found.length > 0 && result.podcast.downloadNew) {
            result.found.forEach(e => {
              library.downloadEpisode(e)
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
}

export default function library() {
  if (!global._library) {
    global._library = new LibraryManager()
  }
  
  return global._library;
}