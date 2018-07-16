let eslint = require("eslint");
let linter = new eslint.Linter();
let fs = require("fs");

exports.validateSource = function(sourceCode, options, description) {
  description = description ? description + " " : "";

  const messages = linter.verify(sourceCode, options);
  const pass = messages.length === 0;

  if (pass) {
    process.stdout.write(".");
  } else {
    console.log("\n" + description + "failed");
    messages.forEach(function(error) {
      const code = eslint.SourceCode.splitLines(sourceCode)[error.line - 1];
      console.log(error.line + ": " + code.trim());
      console.log("   " + error.message);
    });
  }
  return pass;
};

exports.validateFile = function(filename, options) {
  const sourceCode = fs.readFileSync(filename, "utf8");
  return exports.validateSource(sourceCode, options, filename);
};

exports.validateFileList = function(fileList, options) {
  let pass = true;
  fileList.forEach(function(filename) {
    pass = exports.validateFile(filename, options) && pass;
  });
  return pass;
};
