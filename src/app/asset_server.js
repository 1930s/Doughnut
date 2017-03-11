var express = require('express')
var portfinder = require('portfinder')
var Promise = require('bluebird')

import { Podcast, Episode } from './library/models'

export default class AssetServer {
  constructor(port) {
    this.app = express()
    this.port = port

    this.initRoutes()

    this.server = this.app.listen(port, () => {
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
    this.app.get('/podcasts/:id', (req, res) => {
      Podcast.findOne({
        where: { id: req.params.id },
        attributes: [{ exclude: 'imageBlob' }],
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