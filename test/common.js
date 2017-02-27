var fs = require('fs')
var path = require('path')

import Settings from '../src/app/settings'
import Sequelize from '../src/app/library/sequelize'

module.exports = {
  dropLibrary: (done) => {
    /*const databaseFile = path.join(Settings.get('libraryPath'), "Doughnut Library.dnl")

    if (fs.existsSync(databaseFile)) {
      console.log("Dropping existing library ", databaseFile)
      fs.unlink(databaseFile)
    }*/

    global._library = null

    Sequelize.drop().then((dropped) => {
      Sequelize.query(`PRAGMA user_version = 0`).spread((results, m) => {
        done()
      })
    })
  }
}