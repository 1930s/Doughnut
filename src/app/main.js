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

global.app = null

Electron.app.on('ready', () => {
  Logger.debug('Application is ready')

  // Lazily load an instance of app after Electron has inited,
  // then if the Doughnut library is not found we can display a
  // dialog and sort the issue out
  global.app = require('./app')
  global.app.onReady()
})

Electron.app.on('will-quit', () => {
  Logger.debug('Application will quit')
  global.app.shutdown()
})

Electron.app.on('window-all-closed', () => {
  Logger.debug('All windows closed')
  global.app.onWindowAllClosed()
})
