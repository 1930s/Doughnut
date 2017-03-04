import Electron from 'electron'
import url from 'url'
import path from 'path'
import {Podcast, Episode} from '../library/models'
import Library from '../library/manager'

export default class MainWindow {
  constructor() {
    this.window = undefined
  }

  emitEvent(event, data) {
    this.window.webContents.send(event, data)
  }

  show() {
    const mw = this

    this.window = new Electron.BrowserWindow({
      width: 760,
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
     Library().emitFullPodcastState()

      // Manually show the window now it has received it's initial state
      mw.window.show()
    })

    return this.window
  }
}