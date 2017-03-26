var _user$project$Native_Dialog = (function () {
  function chooseFolder (defaultPath) {
    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      const {dialog} = require('electron').remote
      
      dialog.showOpenDialog({
        defaultPath: defaultPath,
        properties: ['openDirectory']
      }, function (filePaths) {
        if (filePaths && filePaths.length >= 1) {
          callback(_elm_lang$core$Native_Scheduler.succeed(filePaths[0]))
        }
      })
    })

    callback(_elm_lang$core$Native_Scheduler.succeed(''))
  }

  return {
    chooseFolder: chooseFolder
  }
}())
