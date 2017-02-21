import Electron from 'electron'

import Logger from './logger'
import WindowManager from './window_manager'
import Menu from './menu'
import Settings from './settings'
import Library from './library/manager'
import AssetServer from './asset_server'

const {dialog, app} = require('electron')
const portfinder = require('portfinder')

class Main {
  constructor() {
    global.DEBUG = true;
    if( DEBUG ) { Logger.log( 'Initialize Application' ); }

    this.ipc = require( 'electron' ).ipcMain;

    this._windowManager = new WindowManager(this);
  }

  windowManager() {
    return this._windowManager
  }

  onReady() {
    Menu.createMenu()

    this.startAssetServer(() => {
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

        this.launchMainWindow()
      })
    })
  }

  startAssetServer(cb) {
    const main = this

    portfinder.getPortPromise()
    .then((port) => {
      main.server = new AssetServer(port)
      cb()
    })
    .catch((err) => {
      console.log(err)
      app.quit()
    })
  }

  launchMainWindow() {
    const mainWindow = this._windowManager.mainWindow()
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
} );

Electron.app.on( 'window-all-closed', () => {
  if( DEBUG ) { Logger.log( 'All of the window was closed.' ); }

  main.onWindowAllClosed();
} );
