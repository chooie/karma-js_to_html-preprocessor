const head = require("./partials/head.js");
const util = require("../../shared/util.js");

exports.page = function page(options) {
  return [
    "html",
    [
      "head",
      "<!-- smoke test marker: App home page -->",
      ["title", "Home - Automatopia NodeJS"],
      ...head.make()
    ],
    [
      "body",
      ["h1", { id: "header-text" }, "Hello, world!"],
      ["script", { src: "bundle.js" }],
      [
        "script",
        util.stripMargin`
          |const client = require("./main.js");
          |console.log(client.isTrue());
          |`
      ]
    ]
  ];
};
