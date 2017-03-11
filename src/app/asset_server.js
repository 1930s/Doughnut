var express = require('express')
var portfinder = require('portfinder')
var Promise = require('bluebird')

import { Podcast, Episode } from './library/models'

export default class AssetServer {
  constructor() {
    this.app = express()
    this.port = 14857

    this.initRoutes()

    this.server = this.app.listen(this.port, () => {
      //console.log("Listening on port " + port)
    })
  }

  static boot(cb) {
    return new Promise((resolve, reject) => {
      portfinder.getPortPromise()
        .then((port) => {
          const self = new AssetServer(port)
          resolve(self)
        })
        .catch(reject)
    })
  }

  close() {
    if (this.server) {
      this.server.close()
    }
  }

  port() {
    return this.port;
  }

  initRoutes() {
    this.app.get('/podcasts', (req, res) => {
      Podcast.findAll({
        attributes: { exclude: ['imageBlob']},
        include: [ Episode ], 
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
      Podcast.findOne({ id: req.params.id })
      .then((pod) => {
        res.send(new Buffer(pod.imageBlob, 'binary'))
      })
    })
  }
}