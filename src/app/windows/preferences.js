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
import Settings from '../settings'

export default class PreferencesWindow {
  constructor () {
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
    this.send('preferences:show', {
      libraryPath: Settings.get('libraryPath')
    })
  }

  close () {
    if (this.window && !this.window.isDestroyed()) {
      this.window.close()
    }
  }

  focus () {
    if (this.window && !this.window.isDestroyed()) {
      this.window.focus()
    }
  }

  isVisible () {
    if (this.window && !this.window.isDestroyed()) {
      return this.window.isVisible()
    } else {
      return false
    }
  }

  show () {
    const prefs = this

    this.window = new Electron.BrowserWindow({
      minWidth: 400,
      minHeight: 300,
      width: 525,
      height: 420,
      resizable: true,
      show: false
    })
    this.window.setMenu(null)

    this.window.loadURL(url.format({
      pathname: path.join(__dirname, `preferences.html`),
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

      prefs.window.show()
    })

    // this.window.on('close', this.saveWindowState)

    return this.window
  }
}
