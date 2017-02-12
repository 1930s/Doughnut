function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

var common = require('./common');

describe("top", function () {
  beforeEach(function () {
    common.dropLibrary()
  });

  importTest("Library", './library/podcast');

  after(function () {
  });
});