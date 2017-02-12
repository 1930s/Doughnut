var expect = require('expect.js')

import Library from '../../src/app/library/manager.js'
import { Podcast } from '../../src/app/library/models'

describe('Podcast', function() {
  beforeEach((done) => {
    Library().load(done)
  })

  it('should subscribe to a podcast', function(done) {
    Library().subscribe("test", function(t) {
      Podcast.find({
        where: { feed: 'test' }
      }).then((p) => {
        expect(p.feed).to.eql('test')
        done()
      })
    })
  })

  it('test', function(done) {
    const {ipcRenderer} = require('electron')
    ipcRenderer.send('asynchronous-message', 'ping')
  })
})