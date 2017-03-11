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

  subscribe() {
    const w = this.window
    const library = Library()

    library.on('podcast:loading', arg => {      
      if (w) {
        w.webContents.send('podcast:loading', { id: arg.id, loading: arg.loading })
      }
    })

    library.on('podcast:updated', podcast => {
      if (w) {
        w.webContents.send('podcast:updated', podcast.viewJson())
      }
    })

    library.on('episode:updated', episode => {
      if (w) {
        w.webContents.send('episode:updated', episode.viewJson())
      }
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