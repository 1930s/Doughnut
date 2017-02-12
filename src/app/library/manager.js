var Umzug = require('umzug')
var path = require('path')
var fs = require('fs')

import Settings from '../settings'
import Migrations from './migrations'
import Sequelize from './sequelize'
import { Podcast } from './models'

class LibraryManager {
  constructor() {
    this.loaded = false
  }

  load(loaded) {
    const library = this

    // Run migrations
    Migrations.migrate(Sequelize, () => {
      library.loaded = true
      loaded()
    })
  }

  /*
  * Subscribe to podcast at feed url
  */
  subscribe(url, callback = () => {}) {
    if (!this.loaded) { throw 'Library not loaded' }

    Podcast.subscribe(url, (podcast) => {
      callback(podcast)
    })
  }

  unsubscribe(podcast, options = {}, callback = () => {}) {

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