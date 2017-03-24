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

const EventEmitter = require('events')

export default class TaskQueue extends EventEmitter {
  constructor () {
    super()

    this.tasks = []
    this.processingTasks = false
  }

  emitState () {
    this.emit('state', this.state())
  }

  // Tasks
  push (task) {
    this.tasks.push(task)
    task.on('state', this.emitState.bind(this))
  }

  // Management Methods
  removeLast () {
    if (this.tasks.length > 0) {
      this.tasks.splice(0, 1)
    }
  }

  currentTask () {
    if (this.tasks.length > 0) {
      return this.tasks[0]
    } else {
      return null
    }
  }

  run (task) {
    const queue = this
    queue.emitState()

    task.run()
    .then(() => {
      queue.removeLast()
      const next = queue.currentTask()
      if (next) {
        queue.run(next)
      } else {
        queue.processingTasks = false
      }

      queue.emitState()
    })
  }

  start () {
    if (!this.processingTasks) {
      const next = this.currentTask()
      if (next) {
        this.processingTasks = true
        this.run(next)
      }
    }
  }

  count () {
    return this.tasks.length
  }

  state () {
    if (this.tasks && this.tasks.length > 0) {
      return this.tasks.map((t, i) => {
        return t.state()
      })
    } else {
      return []
    }
  }
}
