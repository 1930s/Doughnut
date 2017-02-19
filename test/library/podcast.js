var expect = require('expect.js')
var fixture = require('../fixtures/podcast.js');

import Library from '../../src/app/library/manager.js'
import { Podcast, Episode } from '../../src/app/library/models'

describe('Podcast', function() {
  beforeEach((done) => {
    Library().load(done)
  })

  it('should subscribe to a podcast', function(done) {
    const feed = "http://localhost:3000/feed.xml"
    Library().subscribe(feed, function(t) {
      Podcast.find({
        where: { feed: feed }
      }).then((p) => {
        expect(p.title).to.eql(fixture.feed.title)
        expect(p.imageBlob.length).to.be.greaterThan(100)

        Episode.find({
          where: { title: fixture.items[0].title }
        }).then((e) => {
          expect(e.guid).to.eql(fixture.items[0].guid)
          done()
        })        
      })
    })
  })
})