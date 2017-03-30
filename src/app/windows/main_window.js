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

import Electron, { app } from 'electron'
import url from 'url'
import path from 'path'
import Library from '../library/manager'
import Settings from '../settings'

export default class MainWindow {
  constructor (server) {
    this.server = server
    this.window = undefined
  }

  send (message, arg) {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send(message, arg)
    }
  }

  window () {
    return this.window
  }

  subscribe () {
    const mw = this
    const library = Library()

    library.on('podcast:loading', arg => {
      mw.send('podcast:loading', { id: arg.id, loading: arg.loading })
    })

    library.on('podcast:updated', podcast => {
      mw.send('podcast:updated', podcast.viewJson())
    })

    library.on('episode:updated', episode => {
      mw.send('episode:updated', episode.viewJson())
    })

    library.on('tasks', state => {
      mw.send('task:state', state)
    })
  }

  show () {
    const mw = this
    /* const windowState = Settings.get('mainWindow', {
      x: undefined,
      y: undefined,
      width: 902,
      height: 540,
      fullscreen: false
    }) */

    this.window = new Electron.BrowserWindow({
      minWidth: 800,
      minHeight: 540,
      width: 902,
      height: 540,
      resizable: true,
      titleBarStyle: 'hidden-inset',
      show: false
    })

    this.window.loadURL(url.format({
      pathname: path.join(__dirname, `index.html`),
      protocol: 'file:',
      slashes: true
    }))

    if (Settings.isDevelopment()) {
      this.window.webContents.openDevTools({
        mode: 'detach'
      })
    }

    this.window.webContents.on('did-finish-load', () => {
      // Manually show the window now it has received it's initial state
      this.subscribe()

      mw.window.show()
    })

    this.window.webContents.on('close', () => {
      if (Settings.isDevelopment()) {
        app.quit()
      }
    })

    // this.window.on('close', this.saveWindowState)

    return this.window
  }
/* stateChangeHandler () {
    clearTimeout(this.stateChangeTimer)
    this.stateChangeTimer = setTimeout(this.saveWindowState, 100)
  }

  saveWindowState () {
    Settings.set('mainWindow', {
      x: undefined,
      y: undefined,
      width: 902,
      height: 540,
      fullscreen: this.window.isMaximized()
    })
  } */
}
