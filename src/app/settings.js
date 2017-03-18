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

var electron = require('electron')
var path = require('path')
var jsonfile = require('jsonfile')
var fs = require('fs')
var os = require('os')
var merge = require('deepmerge')
import Logger from './logger'

class Settings {
  constructor() {
    this.defaults = {
      firstLaunch: true
    }

    if (this.isProduction()) {
      this.defaults.libraryPath = path.join(electron.app.getPath('music'), "Doughnut")
    } else if (process.env.NODE_ENV === 'test') {
      this.defaults.libraryPath = path.join(os.tmpdir(), "Doughnut")
    } else {
      this.defaults.libraryPath = path.join(electron.app.getPath('music'), "Doughnut_dev")
    }

    Logger.log(`Settings file: ${this.settingsFile()}`)

    this.loaded = false
  }

  settingsPath() {
    return electron.app.getPath('userData')
  }

  isDevelopment() {
    return process.mainModule.filename.indexOf('app.asar') === -1
  }

  isProduction() {
    return !this.isDevelopment()
  }

  settingsFile() {
    if (this.isProduction()) {
      return path.join(this.settingsPath(), '/Doughnut.json')
    } else {
      return path.join(this.settingsPath(), `/Doughnut_${process.env.NODE_ENV}.json`)
    }
  }

  save() {
    jsonfile.writeFileSync(this.settingsFile(), this.loaded)
  }

  store() {
    jsonfile.writeFile(this.settingsFile(), this.loaded)
  }

  load() {
    this.loaded = this.defaults

    if (!fs.existsSync(this.settingsFile())) {
      this.save()
    }

    this.loaded = jsonfile.readFileSync(this.settingsFile())
  }

  loadIfNeeded() {
    if (!this.loaded) {
      this.load()
    }
  }

  get(key, fallback = null) {
    this.loadIfNeeded()
    return this.loaded[key] || fallback
  }

  set(key, val) {
    this.loadIfNeeded()
    this.loaded[key] = merge(this.loaded[key], val)
    this.store()
  }
}

export default new Settings()