const { ipcRenderer, remote } = require('electron')

const audioErrors = {
    aborted:  'The audio playback was aborted.',
    corrupt:  'The audio playback was aborted due to a corruption problem.',
    notFound: 'The audio file could not be found. It may be due to a file move or an unmounted partition.',
    unknown:  'An unknown error occurred.',
};

window.onload = () => {
  var audio = new Audio()
  window.audio = audio

  audio.playbackRate = 1
  audio.muted = false

  audio.addEventListener('error', err => {
    audio.pause()
    switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
            remote.dialog.showErrorBox('Player Error', audioErrors.aborted)
            break;
        case e.target.error.MEDIA_ERR_DECODE:
            remote.dialog.showErrorBox('Player Error', audioErrors.corrupt)
            break;
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            remote.dialog.showErrorBox('Player Error', audioErrors.notFound)
            break;
        default:
            remote.dialog.showErrorBox('Player Error', audioErrors.unknown)
            break;
    }
  })

  audio.addEventListener('loadedmetadata', () => {
    setState({
      duration: audio.duration,
      ready: true
    })
  })

  var staleTimePosition = true
  setInterval(() => { staleTimePosition = true }, 250)

  audio.addEventListener('timeupdate', () => {
    if (staleTimePosition) {
      setState({
        position: audio.currentTime
      })
      staleTimePosition = false
    }
  })

  audio.addEventListener('playing', () => {
    setState({
      pause: audio.paused
    })
  })

  audio.addEventListener('ended', () => {
    setState({
      pause: false,
      duration: 0,
      position: 0
    })
  })

  audio.addEventListener('volumechange', () => {
    setState({
      volume: Math.round(audio.volume * 100)
    })
  })

  var state = {
    pause: false,
    volume: 70,
    duration: 0,
    position: 0,
    ready: false,
    episodeId: 0
  }

  var setState = function (updated) {
    state = Object.assign({}, state, updated)
    ipcRenderer.send('player:process:state', state)
  }

  ipcRenderer.on('src', (event, arg) => {
    console.log('src', arg)
    audio.src = arg
  })

  ipcRenderer.on('play', (event, arg) => {
    setState({ pause: false })
    console.log('play')
    audio.play()
  })

  ipcRenderer.on('pause', (event, arg) => {
    setState({ pause: true })
    console.log('pause')
    audio.pause()
  })

  ipcRenderer.on('toggle', (event, arg) => {
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }

    setState({ pause: audio.paused })
  })

  ipcRenderer.on('volume', (event, arg) => {
    setState({ volume: Math.round(arg) })
    audio.volume = arg / 100
  })

  ipcRenderer.on('seek', (event, arg) => {
    console.log('seek', arg)
    audio.currentTime = arg
  })

  ipcRenderer.on('notify', (event, arg) => {
    new Notification(arg.title, {
       body: arg.body
    })
  })
}