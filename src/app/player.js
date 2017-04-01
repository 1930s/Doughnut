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

import Electron, { ipcMain } from 'electron'
const EventEmitter = require('events')
const url = require('url')
const path = require('path')
const fs = require('fs')

import Library from './library/manager'
import { Podcast } from './library/models'
import Settings from './settings'

class Player extends EventEmitter {
  constructor () {
    super()

    const player = this
    this.startProcess()

    this.state = {
      pause: false,
      volume: 70,
      duration: 0,
      title: '',
      position: 0,
      ready: false,
      episodeId: 0
    }

    this.episode = null

    var staleState = false
    setInterval(() => { player.staleState = true }, 10000)
  }

  startProcess () {
    const player = this
    const w = new Electron.BrowserWindow({
      width: 50,
      height: 50,
      resizable: false,
      show: false,
      skipTaskbar: true
    })

    w.loadURL(url.format({
      pathname: path.join(__dirname, 'player.html'),
      protocol: 'file:',
      slashes: true
    }))

    w.webContents.on('did-finish-load', () => {
      player.setupIpc()

      player.setVolume(Settings.get('player', { volume: 60 }).volume)
    })

    this.process = w
    return w
  }

  setState (updated) {
    const oldState = this.state

    this.state = Object.assign({}, this.state, updated)
    this.emit('state', this.state)

    if (updated.pause !== oldState.pause || updated.duration !== oldState.duration) {
      this.saveEpisodeState()
    } else {
      if (this.staleState) {
        this.saveEpisodeState()
        this.staleState = false
      }
    }
  }

  setupIpc () {
    const player = this

    ipcMain.on('player:process:state', (event, arg) => {
      player.setState(arg)
    })
  }

  command (message, arg) {
    if (this.process && !this.process.isDestroyed()) {
      this.process.webContents.send(message, arg || {})
    }
  }

  ready () {
    return this.episode != null
  }

  saveEpisodeState () {
    if (this.episode) {
      var updatesNeeded = {}

      if (this.episode.duration < 1) {
        updatesNeeded.duration = Math.round(this.state.duration)
      }

      const playPosition = Math.round(this.state.position)
      if (this.state.position > 0 &&
          this.episode.playPosition !== playPosition) {
        updatesNeeded.playPosition = playPosition
      }

      // Mark as played once over 90% played
      if (this.state.duration > 0) {
        const percentPlayed = (this.state.position / this.state.duration) * 100
        if (this.episode.played === false && percentPlayed >= 90) {
          updatesNeeded.played = true
        }
      }

      if (Object.keys(updatesNeeded).length >= 1) {
        const player = this
        console.log('Saving: ', updatesNeeded)
        Library().updateEpisode(player.episode, updatesNeeded)
          .then(episode => {
            player.episode = episode
          })
      }
    }
  }

  load (episode) {
    if (!this.state.pause) {
      this.pause()
    }

    const player = this
    player.episode = episode

    var readyToPlay = () => {
      if (episode.playPosition && episode.playPosition > 0) {
        player.seekTo(episode.playPosition)
      }

      player.setState({
        title: episode.title
      })

      player.play()
    }

    if (episode.downloaded) {
      Podcast.findById(episode.podcast_id)
        .then(podcast => {
          const fileName = podcast.fileName(episode)
          fs.exists(fileName, exists => {
            if (exists) {
              player.command('src', url.format({
                pathname: fileName,
                protocol: 'file:',
                slashes: true
              }))

              readyToPlay()
            }
          })
        })
    } else {
      player.command('src', episode.enclosureUrl)
      readyToPlay()
    }
  }

  play () {
    this.command('play')
  }

  pause () {
    this.command('pause')
  }

  toggle () {
    this.command('toggle')
  }

  seekTo (position) {
    if (!isNaN(parseFloat(position)) && isFinite(position)) {
      this.command('seek', parseInt(position))
    }
  }

  skipForward () {
    this.state.position += 30.0
    this.seekTo(this.state.position)
  }

  skipBack () {
    this.state.position -= 30.0
    this.seekTo(this.state.position)
  }

  setVolume (volume) {
    const clamped = Math.max(0, Math.min(100, volume))

    this.command('volume', clamped)
  }

  volumeUp () {
    this.setVolume(this.state.volume + 10)
  }

  volumeDown () {
    this.setVolume(this.state.volume - 10)
  }

  notify (title, message) {
    this.command('notify', {
      title: title,
      body: message
    })
  }
}

export default new Player()
