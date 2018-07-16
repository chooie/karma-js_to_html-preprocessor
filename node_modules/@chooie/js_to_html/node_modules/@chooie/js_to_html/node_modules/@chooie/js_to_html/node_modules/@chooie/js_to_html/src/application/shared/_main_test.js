const assert = require("_assert");
const main = require("./main.js");
const util = require("./util.js");

describe("SHARED: Main", function() {
  it("gets valid html", function() {
    const structureToConvert = ["html", ["head"], ["body"]];
    const convertedStructure = main.convert(structureToConvert);
    const expectedHtml = util.stripMargin`
      |<!DOCTYPE html>
      |<html>
      |  <head></head>
      |  <body></body>
      |</html>
      |`;
    assert.equal(convertedStructure, expectedHtml);
  });

  it("handles text in element", function() {
    const structureToConvert = ["html", ["head"], ["body", "Hello, world!"]];
    const convertedStructure = main.convert(structureToConvert);
    const expectedHtml = util.stripMargin`
      |<!DOCTYPE html>
      |<html>
      |  <head></head>
      |  <body>
      |    Hello, world!
      |  </body>
      |</html>
      |`;
    assert.equal(convertedStructure, expectedHtml);
  });

  it("handles a paragraph element in an element", function() {
    const structureToConvert = [
      "html",
      ["head"],
      ["body", ["p", "Hello, world!"]]
    ];
    const convertedStructure = main.convert(structureToConvert);
    const expectedHtml = util.stripMargin`
      |<!DOCTYPE html>
      |<html>
      |  <head></head>
      |  <body>
      |    <p>
      |      Hello, world!
      |    </p>
      |  </body>
      |</html>
      |`;
    assert.equal(convertedStructure, expectedHtml);
  });

  it("handles nested elements", function() {
    const structureToConvert = [
      "html",
      ["head"],
      ["body", ["div", ["p", "Hello, world!"]]]
    ];
    const convertedStructure = main.convert(structureToConvert);
    const expectedHtml = util.stripMargin`
      |<!DOCTYPE html>
      |<html>
      |  <head></head>
      |  <body>
      |    <div>
      |      <p>
      |        Hello, world!
      |      </p>
      |    </div>
      |  </body>
      |</html>
      |`;
    assert.equal(convertedStructure, expectedHtml);
  });

  it("handles multiple nested elements", function() {
    const structureToConvert = [
      "html",
      ["head"],
      ["body", ["div", ["h1", "Hello, world!"], ["p", "Goodbye, world!"]]]
    ];
    const convertedStructure = main.convert(structureToConvert);
    const expectedHtml = util.stripMargin`
      |<!DOCTYPE html>
      |<html>
      |  <head></head>
      |  <body>
      |    <div>
      |      <h1>
      |        Hello, world!
      |      </h1>
      |      <p>
      |        Goodbye, world!
      |      </p>
      |    </div>
      |  </body>
      |</html>
      |`;
    assert.equal(convertedStructure, expectedHtml);
  });

  it("errors when information is missing or non-array is passed", function() {
    const wrongDataType = "Wrong";
    assert.exception(
      () => main.convert(wrongDataType),
      "Expected an element array but got '\"Wrong\"' of type 'string'."
    );
    const emptyArray = ["html", ["div", []]];
    assert.exception(
      () => main.convert(emptyArray),
      util.stripMargin`
      |Empty arrays are not a valid input.
      |Context: [
      |  "div",
      |  []
      |]
      |`
    );
  });

  it("handles html attributes for empty elements", function() {
    const structureToConvert = [
      "html",
      ["head"],
      ["body", ["div", ["h1", { class: "class1" }], ["p", { class: "class2" }]]]
    ];
    const convertedStructure = main.convert(structureToConvert);
    const expectedHtml = util.stripMargin`
      |<!DOCTYPE html>
      |<html>
      |  <head></head>
      |  <body>
      |    <div>
      |      <h1 class="class1">
      |      </h1>
      |      <p class="class2">
      |      </p>
      |    </div>
      |  </body>
      |</html>
      |`;
    assert.equal(convertedStructure, expectedHtml);
  });

  it("handles html attributes for nested elements", function() {
    const structureToConvert = [
      "html",
      ["head"],
      [
        "body",
        [
          "div",
          ["h1", { class: "class1" }, ["span", "Hello, world!"]],
          ["p", { class: "class2" }, ["span", "Goodbye, world!"]]
        ]
      ]
    ];
    const convertedStructure = main.convert(structureToConvert);
    const expectedHtml = util.stripMargin`
      |<!DOCTYPE html>
      |<html>
      |  <head></head>
      |  <body>
      |    <div>
      |      <h1 class="class1">
      |        <span>
      |          Hello, world!
      |        </span>
      |      </h1>
      |      <p class="class2">
      |        <span>
      |          Goodbye, world!
      |        </span>
      |      </p>
      |    </div>
      |  </body>
      |</html>
      |`;
    assert.equal(convertedStructure, expectedHtml);
  });

  it("handles html attributes for nested elements", function() {
    const structureToConvert = [
      "html",
      ["head"],
      [
        "body",
        [
          "div",
          ["h1", { class: "class1" }, ["span", "Hello, world!"]],
          ["p", { class: "class2" }, ["span", "Goodbye, world!"]],
          makeListOfNames(["Charlie", "Rachael", "Maddie", "Lilla", "Paul"])
        ]
      ]
    ];
    function makeListOfNames(names) {
      return [
        "ul",
        { class: "names-list" },
        ...names.map(function(name) {
          return ["li", { class: "names-list__name" }, name];
        })
      ];
    }
    const convertedStructure = main.convert(structureToConvert);
    const expectedHtml = util.stripMargin`
      |<!DOCTYPE html>
      |<html>
      |  <head></head>
      |  <body>
      |    <div>
      |      <h1 class="class1">
      |        <span>
      |          Hello, world!
      |        </span>
      |      </h1>
      |      <p class="class2">
      |        <span>
      |          Goodbye, world!
      |        </span>
      |      </p>
      |      <ul class="names-list">
      |        <li class="names-list__name">
      |          Charlie
      |        </li>
      |        <li class="names-list__name">
      |          Rachael
      |        </li>
      |        <li class="names-list__name">
      |          Maddie
      |        </li>
      |        <li class="names-list__name">
      |          Lilla
      |        </li>
      |        <li class="names-list__name">
      |          Paul
      |        </li>
      |      </ul>
      |    </div>
      |  </body>
      |</html>
      |`;
    assert.equal(convertedStructure, expectedHtml);
  });

  it("allows you to combine elements", function() {
    const structureToConvert = [
      "html",
      ["head", makeTitle("Hey")],
      [
        "body",
        makeListOfNames(["Charlie", "Rachael", "Maddie", "Lilla", "Paul"])
      ]
    ];
    const convertedStructure = main.convert(structureToConvert);
    const expectedHtml = util.stripMargin`
      |<!DOCTYPE html>
      |<html>
      |  <head>
      |    <title>
      |      Hey
      |    </title>
      |  </head>
      |  <body>
      |    <ul>
      |      <li>
      |        Charlie
      |      </li>
      |      <li>
      |        Rachael
      |      </li>
      |      <li>
      |        Maddie
      |      </li>
      |      <li>
      |        Lilla
      |      </li>
      |      <li>
      |        Paul
      |      </li>
      |    </ul>
      |  </body>
      |</html>
      |`;
    assert.equal(convertedStructure, expectedHtml);
  });
});

function makeTitle(title) {
  return ["title", title];
}

function makeListOfNames(names) {
  return [
    "ul",
    ...names.map(function(name) {
      return ["li", name];
    })
  ];
}
