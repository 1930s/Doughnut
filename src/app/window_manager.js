import Electron from 'electron'
import url from 'url'
import path from 'path'

export default class WindowManager {
  constructor() {
    this._windows = {
      MainWindow: false
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

    w.webContents.openDevTools()

    this._windows.MainWindow = w
    return w
  }
}