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