var jsonfile = require('jsonfile')
var fs = require('fs')

const defaults = {
  firstLaunch: true,
  libraryPath: ''
}

var loaded = false

export default class Settings {
  static settingsPath() {
    return process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local');
  }

  static isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  static settingsFile() {
    if (Settings.isProduction()) {
      return Settings.settingsPath() + '/Doughnut.json'
    } else {
      return Settings.settingsPath() + '/Doughnut_dev.json'
    }
  }

  static save() {
    jsonfile.writeFileSync(Settings.settingsFile(), loaded)
  }

  static load() {
    loaded = defaults

    if (!fs.existsSync(Settings.settingsFile())) {
      Settings.save()
    }

    loaded = jsonfile.readFileSync(Settings.settingsFile())
  }

  static get(key) {
    if (!loaded) {
      Settings.load()
    }

    return loaded[key]
  }
}