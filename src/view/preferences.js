var Elm = require('../elm/Preferences/Preferences')
const { ipcRenderer, remote } = require('electron')

window.onload = () => {
  var preferences = null

  ipcRenderer.on('preferences:show', (event, arg) => {
    console.log('preferences:show', arg)
    preferences = Elm.Preferences.embed(document.getElementById('preferences'), arg)
  })
}