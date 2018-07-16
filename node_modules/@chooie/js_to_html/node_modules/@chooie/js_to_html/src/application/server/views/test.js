exports.page = function page(options) {
  return [
    "html",
    ["head", ["title", "Test Page"]],
    ["body", ["h1", "Hello, world!"]]
  ];
};
