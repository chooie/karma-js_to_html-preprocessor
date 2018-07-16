const assert = require("_assert");
const main = require("./main.js");

describe("Main", function() {
  it("is true", function() {
    assert.equal(1, 1);
    assert.equal(true, main.isTrue());
  });
});
