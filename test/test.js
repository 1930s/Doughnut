var common = require('./common');
var testServer = require('./test_server.js');

describe("top", function () {
  beforeEach(function(done) {
    common.dropLibrary(done)
  });

  describe("App", function() {
    require('./app/settings');
  })

  describe("Library", function() {
    require('./library/podcast');
    require('./library/tasks');
    require('./library/server');
  });

  after(function () {
  });
});