/*global desc, task, jake, directory*/
const startTime = Date.now();

// We've put most of our require statements in functions (or tasks) so we
// don't have the overhead of loading modules we don't need. At the time this
// refactoring was done, module loading took about half a second, which was
// 10% of our desired maximum of five seconds for a quick build. The require
// statements here are just the ones that are used to set up the tasks.
const paths = require("./config/paths.js");

const strict = !process.env.loose;
if (strict) console.log("For more forgiving test settings, use 'loose=true'");

//*** DIRECTORIES

directory(paths.tempTestfileDir);
directory(paths.buildDir);
directory(paths.buildServerDir);
directory(paths.buildSharedDir);
directory(paths.buildClientDir);
directory(paths.incrementalDir);

//*** GENERAL

desc("Show available tasks");
task(
  "default",
  function() {
    const sh = require("./sh.js");
    sh.run("./tasks.sh -ls", function() {
      // Don't notify Jake so complete event is not triggered
      // Useful for not showing build complete message when we just want to see
      // a task list
    });
  },
  { async: true }
);

desc("Delete all generated files");
task("clean", [], function() {
  jake.rmRf(paths.generatedDir);
});

require("./tasks/build_distribution.js");
require("./tasks/karma.js");
require("./tasks/lint.js");
require("./tasks/run.js");
require("./tasks/test.js");
require("./tasks/version_check.js");

jake.addListener("complete", function() {
  const elapsedSeconds = (Date.now() - startTime) / 1000;
  console.log(`BUILD OK (${elapsedSeconds.toFixed(2)}s)`);
});
