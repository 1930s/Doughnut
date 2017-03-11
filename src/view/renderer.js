var Elm = require('../elm/Main');
var CSS = require('../scss/main.scss');

const { ipcRenderer, remote } = require('electron')
var loaded = false
var app = null

window.onload = () => {
  ipcRenderer.on('load', (event, globalState) => {
    console.log('load', globalState)
    app = Elm.Main.embed(document.getElementById('app'), globalState)

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
  })

  ipcRenderer.on('podcasts:updated', (event, arg) => {
    console.log('podcasts:updated', arg)
    app.ports.podcastsUpdated.send(arg)
  })

  ipcRenderer.on('player:state', (event, arg) => {
    console.log('player:state', arg)
    app.ports.playerState.send(arg)
  })


  //console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
  //ipcRenderer.send('asynchronous-message', 'ping')

 // ReactDOM.render( <MainWindow />, document.getElementById('app'));
}