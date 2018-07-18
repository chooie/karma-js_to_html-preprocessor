const jsToHtml = require("@chooie/js_to_html");

function createJsToHtmlPreprocessor(logger, basePath, args, config) {
  const log = logger.create("preprocessor.js_to_html");

  return function(content, file, done) {
    const filePath = file.originalPath;
    log.debug("Processing '%s'.", filePath);
    const dataFilePath = filePath.replace(".page.js", ".page.karma_data.js");
    const data = loadDataFile(log, filePath, dataFilePath);
    inlineReplaceFileEnding(file, "js", "html");
    const options = Object.assign({}, args, config, data);
    getHtml(log, filePath, options, done);
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

function loadDataFile(log, filePath, dataFilePath) {
  if (moduleIsAvailable(dataFilePath)) {
    log.debug("Processing data file '%s'.", dataFilePath);
    const data = require(dataFilePath);
    clearNodeRequireCache();

    if (!isObject(data)) {
      throw new Error(
        "module.exports must be set to an object containing the expected " +
          "properties of the page in file '" +
          dataFilePath +
          "'."
      );
    }
    return data;
  } else {
    log.debug(
      "No data file at '" +
        dataFilePath +
        "'. Make this file and set " +
        "module.exports to an object containing the expected properties of " +
        "the page at '" +
        filePath +
        "'."
    );
    return {};
  }
}

function inlineReplaceFileEnding(file, current, replacement) {
  const filePath = file.originalPath;
  file.path = filePath.replace(`.${current}`, `.${replacement}`);
}

function moduleIsAvailable(path) {
  try {
    require.resolve(path);
    return true;
  } catch (e) {
    return false;
  }
}

function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object;
}

function getHtml(log, filePath, options, callback) {
  let htmlPage;
  const jsPage = require(filePath);
  clearNodeRequireCache();

  jsToHtml.checkPageIsCorrectlySetup(jsPage, filePath);
  try {
    const structureWithOptions = jsPage.page(options);
    htmlPage = jsToHtml.convert(structureWithOptions);
  } catch (error) {
    log.error("%s\n in file '%s'", error.message, filePath);
  } finally {
    callback(htmlPage);
  }
}

function clearNodeRequireCache() {
  Object.keys(require.cache).forEach(function(key) {
    delete require.cache[key];
  });
}
