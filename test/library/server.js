var expect = require('expect.js')
var sinon = require('sinon')
var fixture = require('../fixtures/podcast.js')
var superagent = require('supertest')
var request = require('request')
var md5File = require('md5-file')

import Library, { LibraryManager } from '../../src/app/library/manager.js'
import { Podcast, Episode } from '../../src/app/library/models'
import AssetServer from '../../src/app/asset_server'

describe('Server', function() {
  var subscribed = null
  var server = null

  beforeEach(done => {
    AssetServer.boot().then((booted) => {
      server = booted
      Library().load(() => {
        Library().subscribe("http://localhost:3000/feed.xml?items=1")
          .then(function(pod) {
            subscribed = pod
            done()
          })
      })
    })
  })

  afterEach(() => {
    server.close()
  })

  it('serves all podcasts data', done => {
    superagent(server.app)
      .get(`/podcasts`)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.length).to.eql(1)
        expect(res.body[0].episodes.length).to.eql(1)
        done()
      })
  })

  it('serves podcast data', done => {
    superagent(server.app)
      .get(`/podcasts/${subscribed.id}`)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.title).to.eql(subscribed.title)
        done()
      })
  })

  it('serves podcast image', done => {
    request({
      url: `http://localhost:${server.port}/podcasts/image/${subscribed.id}`,
      encoding: null
    }, (err, resp, body) => {
      expect(md5File.sync(body)).to.eql("edf756e2c4d9a60d05ded5f2d02f0a94")
      done()
    })
  })
})