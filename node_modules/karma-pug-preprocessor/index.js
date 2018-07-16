var pug = require('pug');

var createPugPreprocessor = function(logger, basePath, args, config) {
  var log = logger.create('preprocessor.pug');

  return function(content, file, done) {
    var processed = null;

    log.debug('Processing "%s".', file.originalPath);
    file.path = file.originalPath.replace(/\.pug$/, '.html');

    var templateName = file.originalPath.replace(/^.*\/([^\/]+)\.pug$/, '$1');

    try {
        var pugOptions = _objectAssign({
            filename: file.originalPath,
            client: true,
            pretty: true
        }, args, config);
        processed = pug.render(content, pugOptions);    
    } catch (e) {
      log.error('%s\n  at %s', e.message, file.originalPath);
    }
    log.debug('Processed content as:\n%s', processed);
    done(processed);
  };
};

function _objectAssign(target) {
  var output = Object(target);
  var idx = 1;
  var length = arguments.length;
  while (idx < length) {
    var source = arguments[idx];
    if (source != null) {
      for (var nextKey in source) {
        if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
    idx += 1;
  }
  return output;
};

createPugPreprocessor.$inject = ['logger', 'config.basePath', 'args', 'config.pugPreprocessor'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:pug': ['factory', createPugPreprocessor]
};
