var assert = require('assert')

import Library from '../../src/app/library/manager.js'
import { Podcast } from '../../src/app/library/models'

describe('Library', function() {
  describe('Podcast', function() {
    it('should subscribe to a podcast', function(done) {
      Library().subscribe("test", function(t) {
        Podcast.find({
          where: { feed: 'test' }
        }).then((p) => {
          assert.equal(p.feed, 'test')
          done()
        })
      })
    })

    it('should find podcast', (done) => {
      Podcast.findAll({}).then((all) => {
        assert.equal(all.length, 1)
        done()
      })
    })
  })
})