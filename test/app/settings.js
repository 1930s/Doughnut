var expect = require('expect.js')

import Settings from '../../src/app/settings.js'

describe('Settings', function() {
  it('should return null for unknown setting', function() {
    expect(Settings.get('unknown')).to.eql(null)
  })

  it('should return fallback for unknown setting', function() {
    expect(Settings.get('unknown', { a: 1, b: 2 })).to.eql({ a: 1, b: 2 })
  })

  it('should merge store setting', function(done) {
    Settings.set('player', { a: 1, b: 2, c: 3 })

    setTimeout(() => {
      Settings.set('player', { b: 5 })
    }, 50)

    setTimeout(() => {
      var player = Settings.get('player')
      expect(player.a).to.eql(1)
      expect(player.b).to.eql(5)
      expect(player.c).to.eql(3)
      done()
    }, 100)
  })

  it('should handle race condition when storing setting', function(done) {
    Settings.set('player', { a: 1, b: 2, c: 3 })
    Settings.set('player', { b: 5 })
    Settings.set('player', { b: 7 })

    setTimeout(() => {
      var player = Settings.get('player')
      expect(player.a).to.eql(1)
      expect(player.b).to.eql(7)
      expect(player.c).to.eql(3)
      done()
    }, 100)
  })
})