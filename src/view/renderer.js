var Elm = require('../elm/Main');
var CSS = require('../scss/main.scss');

const {ipcRenderer} = require('electron')

window.onload = () => {
  var app = Elm.Main.embed(document.getElementById('app'));


  ipcRenderer.on('podcast:state', (event, arg) => {
    console.log(arg) // prints "pong"
  })

  //console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
  //ipcRenderer.send('asynchronous-message', 'ping')

 // ReactDOM.render( <MainWindow />, document.getElementById('app'));
}