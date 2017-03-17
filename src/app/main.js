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

const {dialog, app} = require('electron')

export default class Main {
  constructor() {
    global.DEBUG = true;
    if( DEBUG ) { Logger.log( 'Initialize Application' ); }

    console.log("DEBUG", process.env.DEBUG)

    this.ipc = require( 'electron' ).ipcMain;

    this._windowManager = WindowManager()
  }

  windowManager() {
    return this._windowManager
  }

  onReady() {
    const main = this

    AssetServer.boot()
      .then((server) => {
        main.server = server

        Library().load((err) => {
          if (err) {
            dialog.showMessageBox({
              title: "An error occured whilst loading your Doughnut library database"
            })
          }

    /*
          Library().subscribe("test", function(t) {
            console.log(t)
          })*/
    /*
          Library().podcasts((p) => {
            console.log(p)
          })*/

          /*Library().reload(1, () => {
            console.log("Reloaded")
          })*/

          main._windowManager.setupIPC()

          Menu.createMenu()

          main.launchMainWindow()
        })
      })
      .catch((err) => {
        console.log(err)
        app.quit()
      })
  }

  launchMainWindow() {
    const mainWindow = this._windowManager.mainWindow(this.server)
    mainWindow.show()
  }

  launchWelcomeWindow() {
    this._windowManager.welcomeWindow()
  }

  onWindowAllClosed() {
    if( DEBUG ) { Logger.log( 'Quit' ); }

    Electron.app.quit();
  }
}

const main = new Main();

Electron.app.on( 'ready', () => {
  if( DEBUG ) { Logger.log( 'Application is ready' ); }
  main.onReady();
} );

Electron.app.on( 'quit', () => {
  if( DEBUG ) { Logger.log( 'Application is quit' ); }

  main.windowManager().teardown()
} );

Electron.app.on( 'window-all-closed', () => {
  if( DEBUG ) { Logger.log( 'All of the window was closed.' ); }

  main.onWindowAllClosed();
} );