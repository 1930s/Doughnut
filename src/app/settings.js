var electron = require('electron')
var path = require('path')
var jsonfile = require('jsonfile')
var fs = require('fs')
var os = require('os')
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

  get(key) {
    this.loadIfNeeded()
    return this.loaded[key]
  }
}

export default new Settings()