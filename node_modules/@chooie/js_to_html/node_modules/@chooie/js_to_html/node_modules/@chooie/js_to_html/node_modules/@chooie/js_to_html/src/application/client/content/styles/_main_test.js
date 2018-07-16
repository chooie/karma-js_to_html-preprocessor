const assert = require("_assert");
const cssHelper = require("../_css_test_helper.js");

describe("CSS: Layout", function() {
  cssHelper.setupUnitTests();

  it("has a background color", function() {
    const element = cssHelper.frame.add(
      "<div class='container'></div>",
      "element"
    );
    assert.equal(cssHelper.getBackgroundColor(element), "rgb(0, 191, 255)");
  });
});
