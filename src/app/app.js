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

import Logger from './logger'
import WindowManager from './window_manager'
import Menu from './menu'
import Settings from './settings'
import Library from './library/manager'
import AssetServer from './asset_server'
import Player from './player'

const {dialog, app, globalShortcut} = require('electron')

class Main {
  constructor () {
    this.ipc = require('electron').ipcMain
  }

  onReady () {
    const main = this

    Logger.info(`Settings file: ${Settings.settingsFile()}`)

    AssetServer.setup()
      .then((server) => {
        main.server = server

        Library().load((err) => {
          if (err) {
            dialog.showMessageBox({
              title: 'An error occured whilst loading your Doughnut library database'
            })
          }

          WindowManager.setup()

          Menu.init()
          this.registerGlobalShortcuts()

          Library().on('episodes:discovered', (podcast, episodes) => {
            if (episodes.length > 1) {
              main.notify(podcast.title, `${episodes.length} new episodes discovered`)
            } else if (episodes.length == 1) {
              main.notify(podcast.title, `New episode discovered: ${episodes[0].title}`)
            }
          })

          // If on Mac, add dock badge with unplayed episodes count
          Library().on('podcast:updated', main.updateUnplayedBadge)
          Library().on('episode:updated', main.updateUnplayedBadge)
          main.updateUnplayedBadge()

          main.launchMainWindow()
        })
      })
      .catch((err) => {
        console.log(err)
        app.quit()
      })
  }

  shutdown () {
    globalShortcut.unregisterAll()
    WindowManager.teardown()
  }

  registerGlobalShortcuts () {
    globalShortcut.register('MediaPlayPause', () => {
      Player.toggle()
    })

    globalShortcut.register('MediaNextTrack', () => {
      Player.skipForward()
    })

    globalShortcut.register('MediaPreviousTrack', () => {
      Player.skipBack()
    })
  }

  launchMainWindow () {
    const mainWindow = WindowManager.mainWindow(this.server)

    if (!mainWindow.visible()) {
      mainWindow.show()
    }
  }

  launchWelcomeWindow () {
    WindowManager.welcomeWindow()
  }

  notify (title, message) {
    Player.notify(title, message)
  }

  updateUnplayedBadge () {
    if (process.platform === 'darwin') {
      Library().unplayedCount()
        .then(count => {
          if (count >= 1) {
            app.dock.setBadge(`${count}`)
          } else {
            app.dock.setBadge('')
          }
        })
    }
  }

  onWindowAllClosed () {
    Logger.debug('Quit')
    Electron.app.quit()
  }
}

module.exports = new Main()
