const Promise = require('promise')
const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

import Library from '../manager'
import { Podcast } from '../models'

export default class DownloadTask {
  constructor(episode) {
    this.episode = episode
  }

  run() {
    const episode = this.episode

    return new Promise(function(resolve, reject) {
      Podcast.findById(episode.podcast_id)
        .then(podcast => {
          const podcastPath = path.join(Library().path(), podcast.storagePath())
          if (!fs.existsSync(podcastPath)) {
            fs.mkdirSync(podcastPath)
          }
          
          var file = fs.createWriteStream(
            path.join(Library().path(), podcast.fileName(episode)),
            { defaultEncoding: 'binary' }
          )

          http.get(episode.enclosureUrl, response => {
            response.setEncoding('binary')

            var len = parseInt(response.headers['content-length'], 10)
            var cur = 0
            var total = len / 1048576

            response.on('data', chunk => {
              file.write(chunk)
              cur += chunk.length
            })

            response.on('end', () => {
              file.end()

              episode.update({
                downloaded: true
              })
              .then(saved => {
                resolve(saved)
              })
            })

            response.on('error', (err) => {
              file.end()
              reject(err)
            })
          })
        })
    })
  }
}