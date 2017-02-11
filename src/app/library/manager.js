var Datastore = require('nedb')
var path = require('path')
var fs = require('fs')

import Settings from '../settings'
import Podcast from './podcast'

class LibraryManager {
  constructor() {
  }

  load(loaded) {
    // Ensure library path exists
    const libraryPath = Settings.get('libraryPath')
    const subscriptionsFileName = "Subscriptions.dnl"

    if (!fs.existsSync(libraryPath)) {
      fs.mkdirSync(libraryPath)
    }

    this.subsDB = new Datastore({
      filename: path.join(libraryPath, subscriptionsFileName)
    })

    this.subsDB.loadDatabase((err) => {
      loaded(err)
    })
  }

  subscribe(url, callback = () => {}) {
    Podcast.subscribe(url, (podcast) => {
      this.subsDB.insert(podcast.store(), (err, inserted) => {
        callback(podcast)
      })
    })
  }

  podcasts(callback = () => {}) {
    this.subsDB.find({}, (err, podcasts) => {
      var loaded = podcasts.map((p) => {
        return new Podcast(p)
      })

      callback(loaded)
    })
  }
}

export default function library() {
  if (!global._library) {
    global._library = new LibraryManager()
  }
  
  return global._library;
}