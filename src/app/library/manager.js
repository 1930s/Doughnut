var Datastore = require('nedb')
import Settings from '../settings'

class LibraryManager {
  constructor() {
  }

  init() {
    
  }
}

export default function library() {
  if (!global._library) {
    Settings.isFirstLaunch(function(first) {
      if (first) {
        console.log("First launch")
      } else {
        global._library = new Library()
        console.log("Not first launch")
      }
    })
  }
  
  return global._library;
}