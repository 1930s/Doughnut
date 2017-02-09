var _user$project$Native_ContextMenu = function() {

  function decodeValue(decoder, value) {
    var decodedValue = A2(_elm_lang$core$Native_Json.run, decoder, value);

    if (decodedValue.ctor !== 'Ok') {
      throw Error(decodedValue._0);
    }

    return decodedValue;
  }

  function showMenu(m) {
    const {remote} = require('electron')
    const {Menu, MenuItem} = remote

    const menu = new Menu()
    menu.append(new MenuItem({label: 'MenuItem1', click() {
      return 'item 1 clicked';
    }}))
    menu.append(new MenuItem({type: 'separator'}))
    menu.append(new MenuItem({label: 'MenuItem2', click() {
      return 'item 2 clicked';
    }}))
    menu.popup(remote.getCurrentWindow());

    return "";
  }

  return {
    showMenu: showMenu
  }
}();