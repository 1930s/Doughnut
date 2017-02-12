import Electron from 'electron'
import url from 'url'
import path from 'path'
import {Podcast} from '../library/models'

export default class MainWindow {
  constructor() {
    this.window = undefined
  }

  sendState() {
    var self = this
    Podcast.create({
      name: "Test Podcast"
    }).then(function(p) {
      self.window.webContents.send('podcast:state', p)
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

    mw.sendState()
    this.window.webContents.on('did-finish-load', () => {
      mw.sendState()

      // Manually show the window now it has received it's initial state
      mw.window.show()
    })

    return this.window
  }
}