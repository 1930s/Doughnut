import Electron from 'electron'
import url from 'url'
import path from 'path'
import {Podcast, Episode} from '../library/models'
import Library from '../library/manager'

export default class MainWindow {
  constructor() {
    this.window = undefined
  }

  sendFullState() {
    var self = this
    Podcast.findAll({ include: [ Episode ] }).then((podcasts) => {
      var json = podcasts.map((p) => {
        const episodes = p.Episodes.map((e) => {
          return e.viewJson()
        })

        return Object.assign(p.viewJson(), {
          episodes: episodes
        })
      })
      self.window.webContents.send('podcasts:state', json)
    })
  }

  show() {
    const mw = this

    this.window = new Electron.BrowserWindow({
      width: 900,
      height: 580,
      resizable: true,
      titleBarStyle: 'hidden-inset',
      show: false
    })

    this.window.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    this.window.webContents.openDevTools({
      mode: 'detach'
    })

    this.window.webContents.on('did-finish-load', () => {
      mw.sendFullState()

      // Manually show the window now it has received it's initial state
      mw.window.show()
    })

    return this.window
  }
}