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

import DownloadTask from './tasks/download'

export default class TaskManager {
  constructor() {
    this.tasks = []
    this.processingTasks = false
  }

  // Tasks
  download(episode) {
    this.tasks.push(new DownloadTask(episode))
  }

  // Management Methods
  popTask() {
    if (this.tasks.length > 0) {
      return this.tasks.slice(0, 1)[0]
    } else {
      return null
    }
  }

  run(task) {
    const manager = this
    task.run()
    .then(() => {
      const next = manager.popTask()
      if (next) {
        run(next)
      } else {
        manager.processingTasks = false
      }
    })
  }

  process() {
    if (!this.processingTasks) {
      const next = this.popTask()
      if (next) {
        this.processingTasks = true
        this.run(next)
      }
    }
  }

  queueCount() {
    return this.tasks.length
  }
}