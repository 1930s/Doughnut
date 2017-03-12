import Electron from 'electron'
import url from 'url'
import path from 'path'
import {Podcast, Episode} from '../library/models'
import Library from '../library/manager'

export default class MainWindow {
  constructor(server) {
    this.server = server
    this.window = undefined
  }

  send(message, arg) {
    if (this.window) {
      this.window.webContents.send(message, arg)
    }
  }

  subscribe() {
    const mw = this
    const library = Library()

    library.on('podcast:loading', arg => {      
      mw.send('podcast:loading', { id: arg.id, loading: arg.loading })
    })

    library.on('podcast:updated', podcast => {
      mw.send('podcast:updated', podcast.viewJson())
    })

    library.on('episode:updated', episode => {
      mw.send('episode:updated', episode.viewJson())
    })

    library.on('task:state', state => {
      console.log(state)
    })
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
      // Manually show the window now it has received it's initial state
      this.subscribe()

      mw.window.show()
    })

    return this.window
  }
}