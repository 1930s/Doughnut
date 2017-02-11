import Electron from 'electron'
import url from 'url'
import path from 'path'
const { ipcMain } = require('electron')

import MainWindow from './windows/main_window'

export default class WindowManager {
  constructor() {
    this._windows = {
      MainWindow: false,
      WelcomeWindow: false
    }
  }

  setupIPC() {
    // Global Action
    ipcMain.on('global', (event, arg) => {
      console.log(arg)  // prints "ping"
      event.sender.send('asynchronous-reply', 'pong')
    })

    // Podcast Action
    ipcMain.on('podcast', (event, arg) => {
      console.log(arg)  // prints "ping"
      event.sender.send('asynchronous-reply', 'pong')
    })

    // Player Action


    // Episode Action

    ipcMain.on('synchronous-message', (event, arg) => {
      console.log(arg)  // prints "ping"
      event.returnValue = 'pong'
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