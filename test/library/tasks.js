var expect = require('expect.js')
var fixture = require('../fixtures/podcast.js')
var fs = require('fs')
var path = require('path')
var md5File = require('md5-file')
var Promise = require('bluebird')

import Library from '../../src/app/library/manager.js'
import { Podcast, Episode } from '../../src/app/library/models'
import Task from '../../src/app/library/tasks/task'

describe('Task', function() {
  var subscribed = null
  beforeEach((done) => {
    Library().load(() => {
      Library().subscribe("http://localhost:3000/feed.xml")
        .then(function(pod) {
          subscribed = pod
          done()
        })
    })
  })

  it('should download episode', function(done) {
    Episode.findAll().then(episodes => {
      const episode = episodes[0]
      var notified = false

      Library().on('tasks', state => {
        if (state.tasks.length >= 1) {
          notified = true
        }
      })

      Library().on('episode:updated', ep => {
        if (ep.id == episode.id && ep.downloaded) {
          const exists = path.join(Library().path(), subscribed.fileName(ep))
          expect(fs.existsSync(exists)).to.eql(true)
          expect(md5File.sync(exists)).to.eql("4d35f4941a353af50665e2f5c8a8656c")

          setTimeout(() => {
            expect(Library().downloadQueue.count()).to.eql(0)
            done()
          }, 50)
        }
      })

      // Assert correct file path is created
      expect(subscribed.fileName(episode)).to.eql("Test Podcast/First Item.mp3")
      Library().downloadEpisode(episode)
    })
  })

  it('should process multiple tasks in a row', function(done) {
    var count = 0

    class NullTask extends Task {
      run() {
        return new Promise(function(resolve, reject) {
          setTimeout(() => {
            count += 1
            resolve()
          }, 50)
        })
      }
    }

    for (var i = 0; i < 5; i++) {
      Library().downloadQueue.push(new NullTask())
      Library().downloadQueue.start()
    }

    expect(Library().downloadQueue.count()).to.eql(5)

    setTimeout(() => {
      expect(count).to.eql(5)
      expect(Library().downloadQueue.count()).to.eql(0)
      done()
    }, 400)
  })
})