/*global desc, task, fail, complete, */
const strict = !process.env.loose;

desc("Check dependency versions");
task("versions", ["nodeVersion"]);

task(
  "nodeVersion",
  [],
  function() {
    console.log("Checking Node.js version: .");
    const version = require("./utils/version_checker.js");

    version.check(
      {
        name: "Node",
        expected: require("../../../package.json").engines.node,
        actual: process.version,
        strict: strict
      },
      complete,
      fail
    );
  },
  { async: true }
);
