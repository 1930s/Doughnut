/*
 * Doughnut Podcast Client
 * Copyright (C) 2017 Chris Dyer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
const electron = require('electron')

import WindowManager from './window_manager'
import Player from './player'

var MENUS = {
  FILE: 0,
  EDIT: 1,
  VIEW: 2,
  ITEM: 3,
  CONTROL: 4,
  WINDOW: 5,
  HELP: 6
}

if (process.platform === 'darwin') {
  MENUS = {
    FILE: 1,
    EDIT: 2,
    VIEW: 3,
    ITEM: 4,
    CONTROL: 5,
    WINDOW: 6,
    HELP: 7
  }
}

function menuTemplate () {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Subscribe',
          click () {
            WindowManager.subscribeWindow()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload'
        },
        {
          role: 'forcereload'
        },
        {
          type: 'separator'
        },
        {
          role: 'toggledevtools'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      label: 'Item',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Alt+CmdOrCtrl+R'
        },
        {
          type: 'separator'
        },
        {
          label: 'Play Now',
          accelerator: 'CmdOrCtrl+P'
        },
        {
          type: 'separator'
        },
        {
          label: 'Mark as Played',
          accelerator: 'Ctrl+Cmd+M'
        },
        {
          label: 'Mark as Unplayed',
          accelerator: 'Shift+Cmd+M'
        },
        {
          label: 'Mark as Favourite',
          accelerator: 'CmdOrCtrl+B'
        },
        {
          label: 'Unmark Favourite',
          accelerator: 'Shift+CmdOrCtrl+B'
        },
        {
          type: 'separator'
        },
        {
          label: 'Mark all as Played'
        },
        {
          label: 'Mark all as Unplayed'
        },
        {
          type: 'separator'
        },
        {
          label: 'Download',
          accelerator: 'CmdOrCtrl+L'
        }
      ]
    },
    {
      label: 'Control',
      submenu: [
        {
          label: 'Backward 30 seconds',
          accelerator: 'CmdOrCtrl+Left',
          click () {
            Player.skipBack()
          }
        },
        {
          label: 'Play / Pause',
          accelerator: 'MediaPlayPause',
          click () {
            Player.toggle()
          }
        },
        {
          label: 'Forward 30 seconds',
          accelerator: 'CmdOrCtrl+Right',
          click () {
            Player.skipForward()
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Increase Volume',
          accelerator: 'CmdOrCtrl+Up',
          click () {
            Player.volumeUp()
          }
        },
        {
          label: 'Decrease Volume',
          accelerator: 'CmdOrCtrl+Down',
          click () {
            Player.volumeDown()
          }
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('http://electron.atom.io') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'Doughnut',
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })
    // Edit menu.
    template[MENUS.EDIT].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Speech',
        submenu: [
          {
            role: 'startspeaking'
          },
          {
            role: 'stopspeaking'
          }
        ]
      }
    )
    // Window menu.
    template[MENUS.WINDOW].submenu = [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Zoom',
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    ]
  }

  return template
}

class Menu {
  init () {
    const menu = this

    this.electronMenu = electron.Menu.buildFromTemplate(menuTemplate())
    electron.Menu.setApplicationMenu(this.electronMenu)

    Player.on('state', state => {
      menu.togglePlaybackControls(state)
    })
    menu.togglePlaybackControls(Player.state)
  }

  getMenuItem (label) {
    for (let i = 0; i < this.electronMenu.items.length; i++) {
      const menuItem = this.electronMenu.items[i].submenu.items.find(function (item) {
        return item.label === label
      })
      if (menuItem) return menuItem
    }
  }

  togglePlaybackControls (playerState) {
    const playerReady = Player.ready()

    this.getMenuItem('Backward 30 seconds').enabled = playerReady
    this.getMenuItem('Play / Pause').enabled = playerReady
    this.getMenuItem('Forward 30 seconds').enabled = playerReady
  }
}

export default new Menu()
