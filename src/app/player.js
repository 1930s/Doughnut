const mpvLink = require('node-mpv')
const path = require('path')
const EventEmitter = require('events')

import Library from './library/manager'
import { Podcast } from './library/models'

export default class Player extends EventEmitter {
  constructor() {
    super()

    this.mpv = new mpvLink({
      "audio_only": true,
      binary: path.join(__dirname, "darwin/mpv")
    }, [
      "--cache=auto",
      "--cache-default=2048"
    ])

    this.state = {
      pause: false,
      volume: 60,
      duration: 0,
      mediaTitle: "",
      position: 0
    }

    this.mpv.volume(this.state.volume)

    const player = this

    this.mpv.on('statuschange', mpvStatus => {
      player.state = Object.assign(player.state, {
        pause: mpvStatus.pause,
        volume: mpvStatus.volume,
        duration: mpvStatus.duration,
        mediaTitle: mpvStatus.mediaTitle,
      })
      player.emit('state', player.state)
    })

    this.mpv.on('timeposition', seconds => {
      player.state = Object.assign(player.state, {
        position: seconds
      })
      player.emit('state', player.state)
    })
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

    if (episode.downloaded) {
      Podcast.findById(episode.podcast_id)
        .then(podcast => {
          const episodeFile = path.join(Library().path(), podcast.fileName(episode))
          console.log("Playing: ", episodeFile)
          this.mpv.loadFile(episodeFile)
        })
    } else {
      console.log("Playing: ", episode.enclosureUrl)
      this.mpv.loadStream(episode.enclosureUrl)
    }

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
}