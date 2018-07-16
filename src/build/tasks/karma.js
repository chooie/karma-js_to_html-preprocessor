/*global desc, task, complete, fail */
const paths = require("../config/paths.js");

desc("Start Karma server for testing");
task(
  "karma",
  ["versions"],
  function() {
    karmaRunner().start(
      {
        configFile: paths.karmaConfig
      },
      complete,
      fail
    );
  },
  { async: true }
);

function karmaRunner() {
  return require("simplebuild-karma");
}
