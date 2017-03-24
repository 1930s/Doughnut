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

const Promise = require('bluebird')
const uuidV1 = require('uuid/v1')
const EventEmitter = require('events')

export default class Task extends EventEmitter {
  constructor (props) {
    super()

    this.id = uuidV1()
    this.progress = 0

    this.args = Object.assign({}, {
      anonymous: true,
      indeterminate: true
    }, props)
  }

  setProgress (percent) {
    this.progress = percent
    this.emit('state', this.state())
  }

  anonymous () {
    return this.args.anonymous
  }

  description () {
    return ''
  }

  state () {
    return {
      id: this.id,
      progress: this.progress,
      description: this.description()
    }
  }

  run () {
    return new Promise(function (resolve, reject) {
      resolve()
    })
  }
}
