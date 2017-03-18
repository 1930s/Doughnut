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

const mpvLink = require('node-mpv')
const path = require('path')
const EventEmitter = require('events')

import Library from './library/manager'
import { Podcast } from './library/models'
import Settings from './settings'

class Player extends EventEmitter {
  constructor() {
    super()

    if (Settings.isProduction()) {
      var binary = path.join(__dirname, "../mac/mpv")
    } else {
      var binary = path.join(__dirname, "mac/mpv")
    }

    this.mpv = new mpvLink({
      "audio_only": true,
      binary: binary
    }, [
      "--cache=auto",
      "--cache-default=2048"
    ])

    const player = this

    this.state = {
      pause: false,
      volume: Settings.get('player', { volume: 60 }).volume,
      duration: 0,
      title: "",
      position: 0
    }
    this.episode = null

    this.mpv.volume(this.state.volume)

    this.onStarted = () => {}
    this.mpv.on('started', mpvStatus => {
      player.onStarted()
      player.onStarted = () => {}
    })

    this.mpv.on('paused', mpvStatus => {
      player.saveEpisodeState()
    })

    this.mpv.on('statuschange', mpvStatus => {
      player.state = Object.assign(player.state, {
        pause: mpvStatus.pause,
        volume: mpvStatus.volume,
        duration: mpvStatus.duration
      })

      player.emit('state', player.state)
      player.saveEpisodeState()
    })

    this.mpv.on('timeposition', seconds => {
      player.state = Object.assign(player.state, {
        position: seconds
      })

      player.emit('state', player.state)
      player.saveEpisodeState()
    })
  }

  saveEpisodeState() {
    if (this.episode) {
      var updatesNeeded = {}

      if (this.episode.duration < 1) {
        updatesNeeded.duration = Math.round(this.state.duration)
      } 

      const playPosition = Math.round(this.state.position)
      if (this.state.position > 0 &&
          this.episode.playPosition != playPosition) {
        updatesNeeded.playPosition = playPosition
      }

      // Mark as played once over 90% played
      if (this.state.duration > 0) {
        const percentPlayed = (this.state.position / this.state.duration) * 100
        if (this.episode.played == false && percentPlayed >= 90) {
          updatesNeeded.played = true
        }
      }

      if (Object.keys(updatesNeeded).length >= 1) {
        const player = this
        player.episode.update(updatesNeeded).then(episode => {
          player.episode = episode
        })
      }
    }
  }

  destroy() {
    this.mpv.stop()

    if (this.mpv.mpvPlayer) {
      console.log("Killing")
      this.mpv.mpvPlayer.kill('SIGINT')
    }
  }

  play(episode) {
    if (!this.state.pause) {
      this.mpv.stop()
    }

    this.episode = episode

    if (episode.downloaded) {
      Podcast.findById(episode.podcast_id)
        .then(podcast => {
          this.mpv.loadFile(Library().episodeFilePath(podcast, episode))
        })
    } else {
      console.log("Playing: ", episode.enclosureUrl)
      this.mpv.loadStream(episode.enclosureUrl)
    }

    if (this.episode.playPosition > 0) {
      this.onStarted = () => {
        console.log("Resuming at: ", this.episode.playPosition)
        this.seekTo(this.episode.playPosition)
      }
    }

    this.state.title = episode.title
    this.mpv.play()
  }

  pause() {
    this.mpv.pause()
  }

  toggle() {
    this.mpv.togglePause()
  }

  seekTo(position) {
    this.mpv.goToPosition(position)
  }

  skipForward() {

  }

  skipBack() {

  }

  setVolume(volume) {
    const clamped = Math.max(0, Math.min(100, volume))

    this.mpv.volume(clamped)
    Settings.set('player', { volume: clamped })
  }

  volumeUp() {
    this.setVolume(this.state.volume + 10)
  }

  volumeDown() {
    this.setVolume(this.state.volume - 10)
  }
}

export default new Player()