const uuidV1 = require('uuid/v1')

export default class Task {
  constructor(props) {
    this.id = uuidV1()

    this.args = Object.assign({}, {
      anonymous: true,
      indeterminate: true
    }, props)
  }

  id() {
    return this.id
  }

  anonymous() {
    return this.args.anonymous
  }
}