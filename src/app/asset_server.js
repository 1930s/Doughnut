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

var express = require('express')
var portfinder = require('portfinder')
var Promise = require('bluebird')

import { Podcast, Episode, Category } from './library/models'
import Player from './player'
import Settings from './settings'
import Port from './port'
import Logger from './logger'

export default class AssetServer {
  constructor () {
    this.app = express()
    this.port = Port(Settings.isRelease())

    this.initRoutes()

    this.server = this.app.listen(this.port, () => {
      Logger.info('Asset Server listening on port ' + this.port)
    })
  }

  static setup (cb) {
    return new Promise((resolve, reject) => {
      portfinder.getPortPromise()
        .then((port) => {
          const self = new AssetServer(port)
          resolve(self)
        })
        .catch(reject)
    })
  }

  close () {
    if (this.server) {
      this.server.close()
    }
  }

  port () {
    return this.port
  }

  initRoutes () {
    this.app.get('/podcasts', (req, res) => {
      Podcast.findAll({
        attributes: { exclude: ['imageBlob'] },
        include: [ Episode, Category ],
        order: [[ Episode, 'pubDate', 'DESC' ]]
      })
      .then(podcasts => {
        const response = podcasts.map(podcast => {
          const episodes = podcast.Episodes.map((e) => {
            return e.viewJson()
          })

          return {
            podcast: podcast.viewJson(),
            episodes: episodes,
            loading: false,
            selected: false
          }
        })

        res.json(response)
      })
      .catch(err => {
        console.log(err)
        res.json({})
      })
    })

    this.app.get('/podcasts/:id/episodes', (req, res) => {
      Episode.findAll({
        where: { podcast_id: req.params.id },
        order: [['pubDate', 'DESC']]
      })
      .then(episodes => {
        const response = episodes.map((e) => {
          return e.viewJson()
        })

        res.json(response)
      })
      .catch(err => {
        console.log(err)
        res.json({})
      })
    })

    this.app.get('/podcasts/image/:id', (req, res) => {
      Podcast.findById(req.params.id)
      .then(podcast => {
        res.sendFile(podcast.artworkFile())
      })
    })

    this.app.get('/player/image', (req, res) => {
      if (Player.episode) {
        Podcast.findById(Player.episode.podcast_id)
        .then(podcast => {
          res.sendFile(podcast.artworkFile())
        })
      }
    })
  }
}
