var Elm = require('../elm/Main')
var CSS = require('../scss/main.scss')
var Split = require('./split.js')
var jQuery, $ = require('jquery')

const { ipcRenderer, remote } = require('electron')
var loaded = false
var app = null

import port from '../app/port'

function isRelease() {
  const process = remote.process
  if (!process.versions.electron) {
    // Node.js process
    return false
  }
  if (process.platform === 'darwin') {
    return !/\/Electron\.app\//.test(process.execPath)
  }
  if (process.platform === 'win32') {
    return !/\\electron\.exe$/.test(process.execPath)
  }
  if (process.platform === 'linux') {
    return !/\/electron$/.test(process.execPath)
  }
}

window.onload = () => {
  app = Elm.Main.embed(document.getElementById('app'), {
    serverPort: port(isRelease())
  })

  app.ports.loaded.subscribe(() => {
    var splitter = Split(['.podcasts', '.episodes', '.detail'], {
      gutterSize: 11,
      minSize: [200, 200, 0],
      snapOffset: 10
    })

    //splitter.setSizes([28, 32, 40])
  })

  app.ports.errorDialog.subscribe((message) => {
    remote.dialog.showErrorBox('View Error', message)
  })

  app.ports.objectAction.subscribe((action) => {
    ipcRenderer.send(action.action, { id: action.id })
  })

  app.ports.globalAction.subscribe((action) => {
    ipcRenderer.send(action, {})
  })

  app.ports.floatAction.subscribe((action) => {
    ipcRenderer.send(action.action, action.arg)
  })

  ipcRenderer.on('podcast:loading', (event, arg) => {
    console.log('podcast:loading', arg)
    app.ports.podcastLoading.send(arg)
  })

  ipcRenderer.on('podcast:updated', (event, arg) => {
    console.log('podcast:updated', arg)
    app.ports.podcastUpdated.send(arg)
  })

  ipcRenderer.on('episode:updated', (event, arg) => {
    console.log('episode:updated', arg)
    app.ports.episodeUpdated.send(arg)
  })

  ipcRenderer.on('player:state', (event, arg) => {
    console.log('player:state', arg)
    app.ports.playerState.send(arg)
  })

  ipcRenderer.on('task:state', (event, arg) => {
    console.log('task:state', arg)
    app.ports.taskState.send(arg)
  })

  // Open any anchor tag links in a browser window, rather than current

  // console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
  // ipcRenderer.send('asynchronous-message', 'ping')

 // ReactDOM.render( <MainWindow />, document.getElementById('app'));
}

$(function () {
  $(document).on('click', 'a', (e) => {
    e.preventDefault()

    var href = $(e.currentTarget).attr('href')
    if (href && href.indexOf('http') !== -1) {
      ipcRenderer.send('link', href)
    }
  })
})
