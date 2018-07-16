const jsToHtml = require("@chooie/js_to_html");
const requireFromString = require("require-from-string");

function createJsToHtmlPreprocessor(logger, basePath, args, config) {
  const log = logger.create("preprocessor.js");

  return function(content, file, done) {
    log.debug("Procesing '%s'.", file.originalPath);
    file.path = file.originalPath.replace(/\.js$/, ".html");
    log.debug("Content '%s'.", content);
    const jsPage = requireFromString(content);
    const options = Object.assign({}, args, config);
    const htmlPage = jsToHtml.convert(jsPage.page(options));
    log.debug("HTML '%s'", htmlPage);
    done(htmlPage);
  };
}

createJsToHtmlPreprocessor.$inject = [
  "logger", "config.basePath", "args", "config.jsToHtmlPreprocessor"
];

// PUBLISH DI MODULE
module.exports = {
  "preprocessor:js_to_html": ["factory", createJsToHtmlPreprocessor]
};
