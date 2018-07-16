const hashcat = require("hashcat/lib/libhashcat.js");

exports.go = function(config, success, failure) {
  try {
    config.files.forEach(function(file) {
      process.stdout.write(".");
      hashcat.hashcatify({
        htmlFile: file,
        outputHtmlFile: file
      });
    });
    process.stdout.write("\n");
    return success();
  } catch (err) {
    return failure(err);
  }
};
