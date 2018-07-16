/*global desc, task, rule, fail, directory*/
const paths = require("../config/paths.js");

desc("Lint everything");
task("lint", ["lintLog", "incrementalLint"], function() {
  console.log();
});

task("lintLog", function() {
  process.stdout.write("Linting JavaScript: ");
});

task("incrementalLint", paths.lintDirectories());
task("incrementalLint", paths.lintOutput());
createDirectoryDependencies(paths.lintDirectories());

rule(".lint", determineLintDependency, function() {
  const lint = require("./utils/lint_runner.js");
  const lintConfig = require("../config/eslint.conf.js");

  const passed = lint.validateFile(this.source, lintConfig.options);
  if (passed) fs().writeFileSync(this.name, "lint ok");
  else fail("Lint failed");
});
function determineLintDependency(name) {
  const result = name.replace(/^generated\/incremental\/lint\//, "");
  return result.replace(/\.lint$/, "");
}

function createDirectoryDependencies(directories) {
  directories.forEach(function(lintDirectory) {
    directory(lintDirectory);
  });
}

function fs() {
  return require("fs");
}
