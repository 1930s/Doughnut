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

const Promise = require('promise')
const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const request = require('request')
const progress = require('request-progress')

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
            path.join(Library().path(), podcast.fileName(episode))
          )

          var len = 0
          var cur = 0
          var total = 0

          progress(request(episode.enclosureUrl))
          .on('progress', state => {
            console.log(`Downloaded: ${state.percent}%`)
          })
          .on('end', () => {
            file.end()

            episode.update({
              downloaded: true
            })
            .then(saved => {
              resolve(saved)
            })
          })
          .on('error', (err) => {
            file.end()
            reject(err)
          })
          .pipe(file)
        })
    })
  }
}