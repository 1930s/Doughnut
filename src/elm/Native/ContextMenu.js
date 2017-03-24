var _user$project$Native_ContextMenu = (function () {
  function decodeValue (decoder, value) {
    var decodedValue = A2(_elm_lang$core$Native_Json.run, decoder, value)

    if (decodedValue.ctor !== 'Ok') {
      throw Error(decodedValue._0)
    }

    return decodedValue
  }

  function showMenu (m) {
    return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
      const {remote} = require('electron')
      const {Menu, MenuItem} = remote

      const items = _elm_lang$core$Native_List.toArray(m)

      const menu = new Menu()

      for (var i = 0; i < items.length; i++) {
        var item = items[i]

        if (item.itemType.ctor === 'Separator') {
          menu.append(new MenuItem({type: 'separator'}))
        } else if (item.itemType.ctor === 'Action') {
          menu.append(new MenuItem({
            label: items[i].label,
            enabled: !items[i].disabled,
            click (menuItem) {
              callback(_elm_lang$core$Native_Scheduler.succeed(menuItem.label))
            }
          }))
        }
      }

      menu.popup(remote.getCurrentWindow())

      setTimeout(function () {
        callback(_elm_lang$core$Native_Scheduler.succeed(''))
      }, 1000)
    })
  }

  return {
    showMenu: showMenu
  }
}())
