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