import Electron from 'electron'

import Logger from './logger'
import WindowManager from './window_manager'
import Menu from './menu'

class Main {
  constructor() {
    global.DEBUG = true;
    if( DEBUG ) { Logger.log( 'Initialize Application' ); }

    this.ipc = require( 'electron' ).ipcMain;

    this._windowManager = new WindowManager( this );
  }

  windowManager() {
    return this._windowManager;
  }

  onReady() {
    this._windowManager.mainWindow()
    Menu.createMenu();
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
