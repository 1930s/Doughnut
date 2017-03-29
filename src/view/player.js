const { ipcRenderer, remote } = require('electron')

window.onload = () => {
  const audio = new Audio()

  var state = {
    pause: false,
    volume: 0.7,
    duration: 0,
    title: '',
    position: 0,
    ready: false,
    episodeId: 0
  }

  var setState = function (updated) {
    state = Object.assign({}, state, updated)
    ipcRenderer.send('player:process:state', state)
  }

  ipcRenderer.on('play', (event, arg) => {
    setState({ pause: false })
    audio.play()
  })

  ipcRenderer.on('pause', (event, arg) => {
    setState({ pause: true })
    audio.play()
  })

  ipcRenderer.on('toggle', (event, arg) => {
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  })

  ipcRenderer.on('volume', (event, arg) => {
    setState({ volume: arg })
    audio.volume = arg
  })

  ipcRenderer.on('seek', (event, arg) => {
    audio.currentTime = arg
  })
}