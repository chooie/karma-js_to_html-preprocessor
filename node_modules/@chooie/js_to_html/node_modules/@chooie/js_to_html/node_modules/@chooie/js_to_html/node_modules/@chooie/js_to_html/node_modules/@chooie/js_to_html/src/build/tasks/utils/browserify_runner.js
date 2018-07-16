const fs = require("fs");
const browserify = require("browserify");

exports.bundle = function(config, success, failure) {
  const b = browserify(config.options);

  config.requires.forEach(function(oneRequire) {
    process.stdout.write(".");
    b.require(oneRequire.path, { expose: oneRequire.expose });
  });

  b.bundle(function(err, bundle) {
    if (err) failure(err);
    fs.writeFileSync(config.outfile, bundle);
    console.log();
    success();
  });
};
