import Electron from 'electron'
import url from 'url'
import path from 'path'
const { ipcMain } = require('electron')

import MainWindow from './windows/main_window'
import Library from './library/manager'

export default class WindowManager {
  constructor() {
    this._windows = {
      MainWindow: false,
      WelcomeWindow: false
    }
  }

  setupIPC() {
    const wm = this

    // Global Action
    ipcMain.on('global', (event, arg) => {
      console.log(arg)  // prints "ping"
      event.sender.send('asynchronous-reply', 'pong')
    })

    // Podcast Action
    ipcMain.on('podcast:reload', (event, arg) => {
      console.log('podcast:reload', arg)

      Library().loadPodcast(arg.id)
        .then(function(podcast) {
          return podcast.reload()
        })
        .then(function(loaded) {
          console.log(loaded)
        })
    })

    // Player Action


    // Episode Action

    ipcMain.on('episode:play', (event, arg) => {
      console.log("episode:play", arg)
    })
  }

  mainWindow() {
    if (this._windows.MainWindow) { return this._windows.MainWindow }

    this._windows.MainWindow = new MainWindow();
    return this._windows.MainWindow
  }

  welcomeWindow() {
    if (this._windows.WelcomeWindow) { return this._windows.WelcomeWindow }

    const w = new Electron.BrowserWindow({
      width: 500,
      height: 300,
      resizable: false,
      titleBarStyle: 'hidden-inset'
    })

    w.loadURL(url.format({
      pathname: path.join(__dirname, 'welcome.html'),
      protocol: 'file:',
      slashes: true
    }))

    this._windows.WelcomeWindow = w
    return w
  }
}