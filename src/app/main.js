import Electron from 'electron'

import Logger from './logger'
import WindowManager from './window_manager'
import Menu from './menu'
import globlalLibrary from './library/manager'
import Settings from './settings'

class Main {
  constructor() {
    global.DEBUG = true;
    if( DEBUG ) { Logger.log( 'Initialize Application' ); }

    this.ipc = require( 'electron' ).ipcMain;

    this._windowManager = new WindowManager( this );
  }

  windowManager() {
    return this._windowManager
  }

  onReady() {
    Menu.createMenu()

    // Attempt to locate library or prompt to setup a new one
    if (Settings.get('firstLaunch')) {
      if (DEBUG) { Logger.log( 'First Launch!' ); }

      //this.launchWelcomeWindow()
    } else {
      //this.launchMainWindow()
    }

    this.launchMainWindow()
  }

  launchMainWindow() {
    this._windowManager.mainWindow()
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
