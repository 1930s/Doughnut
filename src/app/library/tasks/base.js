const Promise = require('bluebird')

export default class BaseTask {
  constructor(manager, args) {
    this.manager = manager
    this.args = args
  }

  name() {
    return "Task"
  }

  run() {
    return new Promise(function(resolve, reject) {
      resolve()
    })
  }
}