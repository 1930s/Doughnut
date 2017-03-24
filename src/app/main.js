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

const {dialog, app} = require('electron')

export default class Main {
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

          main.launchMainWindow()
        })
      })
      .catch((err) => {
        console.log(err)
        app.quit()
      })
  }

  launchMainWindow () {
    const mainWindow = WindowManager.mainWindow(this.server)
    mainWindow.show()
  }

  launchWelcomeWindow () {
    WindowManager.welcomeWindow()
  }

  onWindowAllClosed () {
    Logger.debug('Quit')
    Electron.app.quit()
  }
}

const main = new Main()

Electron.app.on('ready', () => {
  Logger.debug('Application is ready')
  main.onReady()
})

Electron.app.on('quit', () => {
  Logger.debug('Application quit')
  WindowManager.teardown()
  Player.destroy()
})

Electron.app.on('window-all-closed', () => {
  Logger.debug('All windows closed')
  main.onWindowAllClosed()
})
