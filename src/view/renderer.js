var Elm = require('../elm/Main');
var CSS = require('../scss/main.scss');

const {ipcRenderer} = require('electron')

window.onload = () => {
  const app = Elm.Main.embed(document.getElementById('app'));


  ipcRenderer.on('podcast:state', (event, arg) => {
    console.log('podcast:state', arg)
    app.ports.podcastState.send(arg)
  })

  //console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
  //ipcRenderer.send('asynchronous-message', 'ping')

 // ReactDOM.render( <MainWindow />, document.getElementById('app'));
}