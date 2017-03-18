/*
 * Doughnut Podcast Client
 * Copyright (C) 2017 Chris Dyer
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Electron from 'electron'
import url from 'url'
import path from 'path'
const { ipcMain, dialog, shell } = require('electron')

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

    Player.on('state', state => {
      if (wm._windows.MainWindow) {
        wm._windows.MainWindow.send('player:state', state)
      }
    })
  }

  main() {
    return this.main
  }

  teardown() {
    Player.destroy()
  }

  setup() {
    const wm = this

    // Podcast Action
    ipcMain.on('podcast:subscribe', (event, arg) => {
      wm.subscribeWindow().close()

      Library().subscribe(arg)
      .catch((err) => {
        dialog.showErrorBox('Invalid Feed', "Doughnut was unable to parse the feed at: " + url)
        return null
      })

      console.log('done')
    })

    ipcMain.on('podcast:reload', (event, arg) => {
      Library().loadPodcast(arg.id)
        .then(podcast => {
          return Library().reload(podcast)
        })
    })

    ipcMain.on('podcast:unsubscribe', (event, arg) => {
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

    ipcMain.on('podcast:played', (event, arg) => {
      Library().markPodcastAllPlayed(arg.id, true)
    })

    ipcMain.on('podcast:unplayed', (event, arg) => {
      Library().markPodcastAllPlayed(arg.id, false)
    })

    // Player Action
    ipcMain.on('player:toggle', (event, arg) => {
      Player.toggle()
    })

    ipcMain.on('player:seek', (event, arg) => {
      Player.seekTo(arg)
    })

    ipcMain.on('player:volume', (event, arg) => {
      Player.setVolume(arg)
    })

    // Episode Action

    ipcMain.on('episode:play', (event, arg) => {
      console.log('episode:play', arg)

      Library().loadEpisode(arg.id)
        .then(episode => {
          Player.play(episode)
        })
    })

    ipcMain.on('episode:download', (event, arg) => {
      Library().loadEpisode(arg.id)
        .then(episode => {
          Library().downloadEpisode(episode)
          Library().processTasks()
        })
    })

    ipcMain.on('episode:favourite', (event, arg) => {
      Library().markEpisodeFavourite(arg.id, true)
    })

    ipcMain.on('episode:unfavourite', (event, arg) => {
      Library().markEpisodeFavourite(arg.id, false)
    })

    ipcMain.on('episode:played', (event, arg) => {
      Library().markEpisodePlayed(arg.id, true)
    })

    ipcMain.on('episode:unplayed', (event, arg) => {
      Library().markEpisodePlayed(arg.id, false)
    })

    ipcMain.on('episode:reveal', (event, arg) => {
      Library().loadEpisode(arg.id)
        .then(episode => {
          shell.showItemInFolder(Library().episodeFilePath(episode.Podcast, episode))
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

export default new WindowManager()