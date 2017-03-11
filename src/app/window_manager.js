import Electron from 'electron'
import url from 'url'
import path from 'path'
const { ipcMain, dialog } = require('electron')

import MainWindow from './windows/main_window'
import Library from './library/manager'
import Player from './player'

class WindowManager {
  constructor() {
    const wm = this

    this._windows = {
      MainWindow: false,
      WelcomeWindow: false,
      SubscribeWindow: false
    }

    this._player = new Player()
    this._player.on('state', state => {
      if (wm._windows.MainWindow) {
        wm._windows.MainWindow.emitEvent('player:state', state)
      }
    })

    Library().emitSubscribe(this.emitEvent.bind(this))
  }

  main() {
    return this.main
  }

  player() {
    return this._player
  }

  teardown() {
    this._player.destroy()
  }

  emitEvent(event, data) {
    console.log("EMIT " + event)

    if (this._windows.MainWindow) {
      this._windows.MainWindow.emitEvent(event, data)
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
    ipcMain.on('podcast:subscribe', (event, arg) => {
      console.log('podcast:subscribe', arg)
      wm.subscribeWindow().close()

      Library().subscribe(arg)
      .catch((err) => {
        dialog.showErrorBox('Invalid Feed', "Doughnut was unable to parse the feed at: " + url)
        return null
      })

      console.log('done')
    })

    ipcMain.on('podcast:reload', (event, arg) => {
      console.log('podcast:reload', arg)

      Library().loadPodcast(arg.id)
        .then(podcast => {
          return Library().reload(podcast)
        })
    })

    ipcMain.on('podcast:unsubscribe', (event, arg) => {
      console.log('podcast:unsubscribe', arg)

      Library().loadPodcast(arg.id)
        .then(function(podcast) {
          dialog.showMessageBox({
            buttons: ['Leave Files', 'Delete Files'],
            message: 'Delete Episodes?',
            detail: `Would you like to permanently delete all downloaded episodes of ${podcast.title}`,
          }, deleteFiles => {
            if (deleteFiles) {
              Library().unsubscribe(podcast, { permanent: true })
            } else {
              Library().unsubscribe(podcast, { permanent: false })
            }

            return null
          })
        })
    })

    // Player Action
    ipcMain.on('player:toggle', (event, arg) => {
      console.log('player:toggle')
      wm._player.toggle()
    })

    ipcMain.on('player:seek', (event, arg) => {
      console.log('player:seek', arg)
      wm._player.seekTo(arg)
    })

    // Episode Action

    ipcMain.on('episode:play', (event, arg) => {
      console.log('episode:play', arg)

      Library().loadEpisode(arg.id)
        .then(episode => {
          wm._player.play(episode)
        })
    })

    ipcMain.on('episode:download', (event, arg) => {
      console.log('episode:download', arg)

      Library().loadEpisode(arg.id)
        .then(episode => {
          Library().downloadEpisode(episode)
          Library().processTasks()
        })
    })

    ipcMain.on('episode:favourite', (event, arg) => {
      console.log('episode:favourite', arg)

      Library().loadEpisode(arg.id)
        .then(episode => {
          episode.update({
            favourite: !episode.favourite
          })
        })
    })
  }

  mainWindow(server) {
    if (this._windows.MainWindow) { return this._windows.MainWindow }

    this._windows.MainWindow = new MainWindow(server);
    return this._windows.MainWindow
  }

  subscribeWindow() {
    if (this._windows.SubscribeWindow) { return this._windows.SubscribeWindow }

    const w = new Electron.BrowserWindow({
      width: 500,
      height: 300,
      resizable: false
    })

    w.loadURL(url.format({
      pathname: path.join(__dirname, 'subscribe.html'),
      protocol: 'file:',
      slashes: true
    }))

    this._windows.SubscribeWindow = w
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

export default function wm() {
  if (!global._wm) {
    global._wm = new WindowManager()
  }
  
  return global._wm;
}