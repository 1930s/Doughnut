import Electron from 'electron'
import url from 'url'
import path from 'path'

export default class WindowManager {
  constructor() {
    this._windows = {
      MainWindow: false,
      WelcomeWindow: false
    }
  }

  mainWindow() {
    if (this._windows.MainWindow) { return this._windows.MainWindow }

    const w = new Electron.BrowserWindow({
      width: 900,
      height: 580,
      resizable: true,
      titleBarStyle: 'hidden-inset'
    })

    w.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    //w.webContents.openDevTools()

    this._windows.MainWindow = w
    return w
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