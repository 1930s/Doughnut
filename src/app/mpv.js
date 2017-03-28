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

const MPV = require('node-mpv')
const path = require('path')

import Settings from './settings'

if (process.env.NODE_ENV !== 'test') {
  var mpvBinary = path.join(__dirname, 'mac/mpv')

  if (Settings.isRelease()) {
    mpvBinary = path.join(__dirname, '../mac/mpv')
  }

  global.mpv = new MPV({
    'audio_only': true,
    binary: mpvBinary
  }, [
    '--cache=auto',
    '--cache-default=2048'
  ])
} else {
  global.mpv = {
    volume: () => {},
    on: () => {},
    loadStream: () => {},
    loadFile: () => {},
    seekTo: () => {}
  }
}

module.exports = {
  mpv: function () {
    return global.mpv
  },

  destroy: function () {
    global.mpv.stop()

    if (global.mpv && global.mpv.mpvPlayer) {
      try {
        global.mpv.mpvPlayer.kill('SIGINT')
      } catch (e) {

      }
    }
  }
}
