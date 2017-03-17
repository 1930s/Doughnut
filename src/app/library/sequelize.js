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
import Umzug from 'umzug'
import Settings from '../settings'
import Logger from '../logger'

var path = require('path')
var fs = require('fs')

const libraryPath = Settings.get('libraryPath')

if (!fs.existsSync(libraryPath)) {
  fs.mkdirSync(libraryPath)
}

var sequelize = new Sequelize('', '', '', {
  dialect: 'sqlite',
  logging: false,
  storage: path.join(libraryPath, "Doughnut Library.dnl")
}); 

/*
const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize
  }
})

console.log("Migrating")
umzug.up().then((migrations) => {
  console.log("Migrated: ", migrations)
  loaded(err)
})*/

module.exports = sequelize