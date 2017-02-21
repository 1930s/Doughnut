var express = require('express')
var app = express()

import {Podcast} from './library/models'

export default class AssetServer {
  constructor(port) {
    this.initRoutes()

    app.listen(port, () => {
      console.log("Listening on port " + port)
    })
  }

  initRoutes() {
    app.get('/podcasts/:id', (req, res) => {
      Podcast.findOne({ id: req.params.id })
      .then((pod) => {
        res.send(new Buffer(pod.imageBlob, 'binary'))
      })
    })
  }
}