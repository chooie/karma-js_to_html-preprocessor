const jsToHtml = require("@chooie/js_to_html");

function createJsToHtmlPreprocessor(logger, basePath, args, config) {
  const log = logger.create("preprocessor.js");

  return function(content, file, done) {
    const filePath = file.originalPath;
    log.debug("Processing '%s'.", filePath);
    inlineReplaceFileEnding(file, "js", "html");
    const jsPage = require(filePath);
    const options = Object.assign({}, args, config);
    jsToHtml.checkPageIsCorrectlySetup(jsPage, filePath);

    let htmlPage;
    try {
      const structureWithOptions = jsPage.page(options);
      htmlPage = jsToHtml.convert(structureWithOptions);
    } catch (error) {
      log.error("%s\n in file '%s'", error.message, filePath);
    } finally {
      done(htmlPage);
    }
  };
}

createJsToHtmlPreprocessor.$inject = [
  "logger",
  "config.basePath",
  "args",
  "config.jsToHtmlPreprocessor"
];

module.exports = {
  "preprocessor:js_to_html": ["factory", createJsToHtmlPreprocessor]
};

function inlineReplaceFileEnding(file, current, replacement) {
  const filePath = file.originalPath;
  file.path = filePath.replace(`.${current}`, `.${replacement}`);
}
