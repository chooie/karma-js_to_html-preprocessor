const head = require("./partials/head.js");

exports.page = function page() {
  return [
    "html",
    [
      "head",
      "<!-- smoke test marker: App 404 page -->",
      ["title", "Page Not Found - Automatopia NodeJS"],
      ...head.make()
    ],
    [
      "body",
      ["h1", { id: "header-text" }, "404: Page Not Found :("],
      ["a", { href: "/" }, "Go Home"]
    ]
  ];
};
