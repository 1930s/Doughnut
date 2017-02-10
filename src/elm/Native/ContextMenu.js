var _user$project$Native_ContextMenu = function() {

  function decodeValue(decoder, value) {
    var decodedValue = A2(_elm_lang$core$Native_Json.run, decoder, value);

    if (decodedValue.ctor !== 'Ok') {
      throw Error(decodedValue._0);
    }

    return decodedValue;
  }

  function showMenu(m) {
    return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
      const {remote} = require('electron')
      const {Menu, MenuItem} = remote

      const menu = new Menu()
      menu.append(new MenuItem({label: 'MenuItem1', click() {
        callback(_elm_lang$core$Native_Scheduler.succeed("1"));
      }}))
      menu.append(new MenuItem({type: 'separator'}))
      menu.append(new MenuItem({label: 'MenuItem2', click() {
        callback(_elm_lang$core$Native_Scheduler.succeed("2"));
      }}))
      menu.popup(remote.getCurrentWindow());

      setTimeout(function() {
        callback(_elm_lang$core$Native_Scheduler.succeed(""));
      }, 1000);
    });
  }

  return {
    showMenu: showMenu
  }
}();