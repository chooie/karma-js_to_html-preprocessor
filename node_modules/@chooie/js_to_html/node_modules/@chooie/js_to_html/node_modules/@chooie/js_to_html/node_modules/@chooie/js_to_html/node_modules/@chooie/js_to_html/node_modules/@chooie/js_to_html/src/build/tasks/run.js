/*global desc, task, complete */

let configuration = require("../../application/server/config.js").getConfig(
  "development"
);

desc("Start localhost server for manual testing");
task(
  "run",
  ["nodeVersion", "build:all"],
  function() {
    const runServer = require("../../application/_run_server.js");

    console.log("Running server. Press Ctrl-C to stop.");
    runServer.runInteractively(configuration);
    complete();
  },
  { async: true }
);

desc("Watch test and run (run with ./watch.sh)");
task("run-test", ["clean", "run", "test:all"]);
