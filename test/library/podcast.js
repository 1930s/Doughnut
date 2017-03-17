var expect = require('expect.js')
var sinon = require('sinon')
var fixture = require('../fixtures/podcast.js');

import Library, { LibraryManager } from '../../src/app/library/manager.js'
import { Podcast, Episode } from '../../src/app/library/models'

describe('Podcast', function() {
  beforeEach(done => {
    Library().load(done)
  })

  it('should subscribe to a podcast with valid feed', function(done) {
    const feed = "http://localhost:3000/feed.xml"

    Library().on('podcast:updated', podcast => {
      Episode.find({
        where: { title: fixture.items[0].title }
      }).then((e) => {
        expect(e.guid).to.eql(fixture.items[0].guid)

        done()
      })
    })

    Library().subscribe(feed)
      .then(function(podcast) {
        Podcast.find({
          where: { feed: feed }
        }).then((p) => {
          expect(p.title).to.eql(fixture.feed.title)
          expect(p.imageBlob.length).to.be.greaterThan(100)
        })
      })
  })

  it('should fail to subscribe to invalid feed', function(done) {
    const feed = "thisdoesntwork"
    Library().subscribe(feed)
      .catch(function(err) {
        expect(err).to.be.ok()
        //expect(receiver.calledWith('podcast:state')).to.eql(true)

        // Check nothing has been saved
        Podcast.count().then(function(c) {
          expect(c).to.eql(0)
          done()
        })
      })
  })

  describe('when subscribed', function() {
    var subscribed = null
    beforeEach((done) => {
      Library().subscribe("http://localhost:3000/feed.xml?items=1")
        .then(function(pod) {
          subscribed = pod
          done()
        })
    })

    it('should detect existing episodes', function(done) {
      Episode.count().then((c) => {
        expect(c).to.eql(1)

        Library().reload(subscribed)
          .then(() => {
            Episode.count().then((c) => {
              expect(c).to.eql(1)
              done()
            })
          })
      })
    })

    it('should discover and download new episodes', function(done) {
      subscribed.update({
        downloadNew: true,
        feed: "http://localhost:3000/feed.xml?items=3"
      })
      .then((p) => {
        Library().reload(p)
          .then(() => {
            // 2 new episodes should be found and scheduled for download
            expect(Library().taskManager.queueCount()).to.eql(2)

            Episode.count().then((c) => {
              expect(c).to.eql(3)
              done()
            })
          })
      })
    })

    it('should unsubscribe from podcast', function(done) {
      Library().on('podcast:unsubscribed', podcast => {
        expect(podcast.id).to.eql(subscribed.id)
        done()
      })

      Library().unsubscribe(subscribed)
        .then(function() {
          Podcast.count().then(function(c) {
            expect(c).to.eql(0)
          })
        })
    })
  })
})