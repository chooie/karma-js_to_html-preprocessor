const jsToHtml = require("../shared/main.js");
const util = require("../shared/util.js");

exports.makeIndexPage = function makeIndexPage() {
  return jsToHtml.convert([
    "html",
    [
      "head",
      "<!-- smoke test marker: App home page -->",
      makeTitle("Home - Automatopia NodeJS"),
      ...headInfo()
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
  ]);
};

exports.make404Page = function make404Page() {
  return jsToHtml.convert([
    "html",
    [
      "head",
      "<!-- smoke test marker: App 404 page -->",
      makeTitle("Page Not Found - Automatopia NodeJS"),
      ...headInfo()
    ],
    [
      "body",
      ["h1", { id: "header-text" }, "404: Page Not Found :("],
      ["a", { href: "/" }, "Go Home"]
    ]
  ]);
};

function makeTitle(title) {
  return ["title", title];
}

function headInfo() {
  return [
    [
      "link",
      {
        rel: "stylesheet",
        type: "text/css",
        href: "styles/vendor/normalize-3.0.2.css"
      }
    ],
    ["link", { rel: "stylesheet", type: "text/css", href: "styles/main.css" }],
    [
      "link",
      { rel: "shortcut icon", type: "image/png", href: "nodejs-512.png" }
    ]
  ];
}
