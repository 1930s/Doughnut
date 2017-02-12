var fs = require('fs')
var path = require('path')

import Settings from '../src/app/settings'

module.exports = {
  dropLibrary: () => {
    const databaseFile = path.join(Settings.get('libraryPath'), "Doughnut Library.dnl")

    if (fs.existsSync(databaseFile)) {
      console.log("Dropping existing library ", databaseFile)
      fs.unlink(databaseFile)
    }
  }
}