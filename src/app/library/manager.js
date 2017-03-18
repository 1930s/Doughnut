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

var Umzug = require('umzug')
var path = require('path')
var fs = require('fs')
const { dialog } = require('electron')
const Promise = require('bluebird')
const EventEmitter = require('events')

import Settings from '../settings'
import Migrations from './migrations'
import Sequelize from './sequelize'
import { Podcast, Episode } from './models'
import TaskManager from './tasks'
import Task from './task'

export class LibraryManager extends EventEmitter {
  constructor() {
    super()

    this.loaded = false
    this.taskManager = new TaskManager()
    this.tasks = []
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
  * Task tracking
  */

  registerTask(task) {
    this.tasks.push(task)
    this.emitTaskState()
    return task
  }

  completeTask(task) {
    this.tasks = this.tasks.filter(t => { return t.id !== task.id })
    this.emitTaskState()
  }

  emitTaskState() {
    this.emit('tasks', {
      processing: this.tasks.length > 0
    })
  }

  /*
  * Subscribe to podcast at feed url
  */
  subscribe(url) {
    if (!this.loaded) { throw 'Library not loaded' }
    const library = this

    return new Promise(function(resolve, reject) {
      const task = library.registerTask(new Task())

      Podcast.subscribe(url)
        .then(result => {
          // Emit
          if (result && result.podcast) {
            library.emit('podcast:updated', result.podcast)
          }
          
          library.completeTask(task)
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
      Podcast.findById(id)
      .then(resolve)
      .catch(reject)
    })
  }

  loadEpisode(id) {
    return new Promise((resolve, reject) => {
      Episode.find({ where: { id: id }, include: [Podcast] })
      .then(resolve)
      .catch(reject)
    })
  }

  episodeFilePath(podcast, episode) {
    return path.join(this.path(), podcast.fileName(episode))
  }

  markEpisodePlayed(episodeId, played = true) {
    const library = this

    Episode.findById(episodeId)
      .then(episode => {
        episode.update({ played: played })
          .then(updated => {
            library.emit('episode:updated', updated)
          })
      })
  }

  markEpisodeFavourite(episodeId, favourite = true) {
    const library = this

    Episode.findById(episodeId)
      .then(episode => {
        episode.update({ favourite: favourite })
          .then(updated => {
            library.emit('episode:updated', updated)
          })
      })
  }

  markPodcastAllPlayed(podcastId, played = true) {
    const library = this

    Podcast.findById(podcastId)
      .then(podcast => {
        Episode.update(
          { played: played },
          { where: { podcast_id: podcast.id }}
        ).then((count, rows) => {
          library.emit('podcast:updated', podcast)
        })
      })
  }

  updateEpisode(episode, args) {
    const library = this
    episode.update(args)
      .then(updated => {
        library.emit('episode:updated', updated)
      })
  }

  reload(podcast) {
    const library = this

    return new Promise((resolve, reject) => {
      var preReload = new Date()
      library.emit('podcast:loading', { id: podcast.id, loading: true })

      Podcast.findById(podcast.id)
        .then(podcast => {
          return podcast.syncFeed()
        })
        .then(result => {
          library.emit('podcast:loading', { id: podcast.id, loading: false })
          library.emit('podcast:updated', result.podcast)

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