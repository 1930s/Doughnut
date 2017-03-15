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

    const player = this

    this.state = {
      pause: false,
      volume: 60,
      duration: 0,
      mediaTitle: "",
      position: 0
    }
    this.episode = null

    this.savedStateStale = false
    // Crudely rate limit the current position saves
    setInterval(() => { player.savedStateStale = true }, 3000)

    this.mpv.volume(this.state.volume)

    this.onStarted = () => {}
    this.mpv.on('started', mpvStatus => {
      player.onStarted()
      player.onStarted = () => {}
    })

    this.mpv.on('paused', mpvStatus => {
      player.saveState()
    })

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

      if (player.savedStateStale && player.episode) {
        player.saveState()
      }
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

    this.episode = episode

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

    if (this.episode.playPosition > 0) {
      this.onStarted = () => {
        console.log("Resuming at: ", this.episode.playPosition)
        this.seekTo(this.episode.playPosition)
      }
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

  saveState() {
    const player = this
    this.savedStateStale = false

    if (player.episode) {
      player.episode.update({
        playPosition: Math.round(player.state.position)
      }).then(saved => {
        player.episode = saved
      })
    }
  }
}