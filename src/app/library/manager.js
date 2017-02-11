var Umzug = require('umzug')
var path = require('path')
var fs = require('fs')

import Settings from '../settings'
import Migrations from './migrations'
import Sequelize from './sequelize'
import { Podcast } from './models'

class LibraryManager {
  constructor() {
  }

  load(loaded) {
    // Run migrations
    Migrations.migrate(Sequelize, () => {
      loaded()
    })
    
    
/*
    this.sequelize = new Sequelize('database', 'username', 'password', {
      dialect: 'sqlite',
      storage: path.join(libraryPath, subscriptionsFileName)
    })

    this.sequelize
      .authenticate()
      .then((err) => {
        // Run pending migrations
        const umzug = new Umzug({
          storage: 'sequelize'
        })

        console.log("Migrating")
        umzug.up().then((migrations) => {
          console.log("Migrated: ", migrations)
          loaded(err)
        })
      })*/
    
  }

  subscribe(url, callback = () => {}) {
    Podcast.subscribe(url, (podcast) => {
      callback(podcast)
    })
  }

  podcasts(callback = () => {}) {
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