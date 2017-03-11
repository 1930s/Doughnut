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

          return Object.assign(podcast.viewJson(), {
            episodes: episodes
          })
        }) 
        
        res.json(response)
      })
      .catch(err => {
        console.log(err)
        res.json({})
      })
    })

    this.app.get('/podcasts/:id', (req, res) => {
      Podcast.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ['imageBlob']},
        include: [ Episode ], 
        order: [[ Episode, 'pubDate', 'DESC' ]]
      })
      .then(podcast => {
        const episodes = podcast.Episodes.map((e) => {
          return e.viewJson()
        })

        res.json(
          Object.assign(podcast.viewJson(), {
            episodes: episodes
          })
        )
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