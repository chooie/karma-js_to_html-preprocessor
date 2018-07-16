// const jsToHtml = require("@chooie/js_to_html");

function createJsToHtmlPreprocessor(logger, basePath, args, config) {
  const log = logger.create("preprocessor.js");

  return function(content, file, done) {
    log.debug("Procesing '%s'.", file.originalPath);
    file.path = file.originalPath.replace(/\.js$/, ".html");
    log.debug("Content '%s'.", content);
    done(content);
  };
}

createJsToHtmlPreprocessor.$inject = ["logger", "config.basePath", "args", "config.pugPreprocessor"];

// PUBLISH DI MODULE
module.exports = {
  "preprocessor:js_to_html": ["factory", createJsToHtmlPreprocessor]
};
