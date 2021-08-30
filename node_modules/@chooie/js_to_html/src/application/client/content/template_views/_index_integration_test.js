let assert = require("_assert");
let cssHelper = require("../_css_test_helper.js");

describe("CSS: Home page", function() {
  let frame;

  before(function(done) {
    this.timeout(10 * 1000);
    var options = {
      src:
        "/base/src/application/client/content/template_views/index.page.html",
      width: cssHelper.smallestDeviceWidth
    };
    frame = cssHelper.createFrame(options, done);
  });

  after(function() {
    frame.remove();
  });

  beforeEach(function() {
    frame.reset();
  });

  it("has a background color", function() {
    assert.equal(
      cssHelper.getBackgroundColor(frame.body()),
      "rgb(0, 191, 255)"
    );
  });
});
