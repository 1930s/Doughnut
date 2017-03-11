var Elm = require('../elm/Main');
var CSS = require('../scss/main.scss');

const { ipcRenderer, remote } = require('electron')
var loaded = false
var app = null

window.onload = () => {
  app = Elm.Main.embed(document.getElementById('app'), {})

  app.ports.errorDialog.subscribe((message) => {
    remote.dialog.showErrorBox("View Error", message)
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


  //console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
  //ipcRenderer.send('asynchronous-message', 'ping')

 // ReactDOM.render( <MainWindow />, document.getElementById('app'));
}