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

import Sequelize from 'sequelize'
import Settings from '../settings'

var path = require('path')
var fs = require('fs')
var { dialog, app } = require('electron')

var libraryPath = Settings.get('libraryPath')

if (!fs.existsSync(libraryPath)) {
  if (libraryPath === Settings.defaults.libraryPath) {
    // This is probably the first launch, create Doughnut folder automatically
    fs.mkdirSync(libraryPath)
  } else {
    // The user's library might be on a disconnected network drive
    var locateMsgIndex = dialog.showMessageBox({
      type: 'question',
      buttons: ['Locate Library', 'Quit'],
      defaultId: 0,
      message: 'Doughnut Library Not Found',
      detail: 'Your Doughnut library could not be found. If this is your first time launching Doughnut, a folder to store your library could not be created automatically. Please choose one from the options below.'
    })

    if (locateMsgIndex === 0 /* Locate Library */) {
      var newLibraryPath = dialog.showOpenDialog({
        defaultPath: app.getPath('music'),
        properties: ['openDirectory']
      })

      console.log(newLibraryPath)

      if (newLibraryPath && newLibraryPath.length >= 1) {
        libraryPath = newLibraryPath[0]
        Settings.set('libraryPath', libraryPath)
      }
    } else {
      app.quit()
    }
  }
}

var sequelize = new Sequelize('', '', '', {
  dialect: 'sqlite',
  logging: false,
  storage: path.join(libraryPath, 'Doughnut Library.dnl')
})

module.exports = sequelize
