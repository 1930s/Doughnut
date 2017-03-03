var expect = require('expect.js')
var fixture = require('../fixtures/podcast.js')
var fs = require('fs')
var path = require('path')
var md5File = require('md5-file')

import Library from '../../src/app/library/manager.js'
import { Podcast, Episode } from '../../src/app/library/models'

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

      // Assert correct file path is created
      expect(subscribed.fileName(episode)).to.eql("Test Podcast/First Item.mp3")
      Library().downloadEpisode(episode)
      Library().processTasks()

      var tested = false
      setInterval(() => {
        // Poll for episode to be downloaded
        Episode.findById(episode.id).then((ep) => {
          if (ep.downloaded && !tested) {
            tested = true
            const exists = path.join(Library().path(), subscribed.fileName(ep))
            expect(fs.existsSync(exists)).to.eql(true)
            expect(md5File.sync(exists)).to.eql("4d35f4941a353af50665e2f5c8a8656c")

            done()
          }
        })
      }, 100)
    })
  })
})