function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

var common = require('./common');
var testServer = require('./test_server.js');

describe("top", function () {
  beforeEach(function(done) {
    common.dropLibrary(done)
  });

  importTest("Library", './library/podcast');

  after(function () {
  });
});