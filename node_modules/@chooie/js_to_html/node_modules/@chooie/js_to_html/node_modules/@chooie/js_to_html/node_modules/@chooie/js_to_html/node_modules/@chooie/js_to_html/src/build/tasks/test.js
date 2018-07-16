/*global namespace, desc, task, file, fail, complete, */
const strict = !process.env.loose;
const paths = require("../config/paths.js");

namespace("test", function() {
  desc("Check everything works as expected");
  task("all", ["clean", "quick", "smoke"], function() {});

  desc("Quick check - uses cached results");
  task("quick", ["versions", "lint", "incremental:unitAndIntegration"]);

  namespace("incremental", function() {
    desc("Test everything (except smoke tests)");
    task("unitAndIntegration", ["shared", "server", "client"]);

    desc("Test client code");
    task("client", ["clientUi", "testClientCss"]);

    desc("Test shared code");
    task("shared", ["sharedOnServer", "sharedOnClient"]);

    desc("Test server code");
    incrementalTask(
      "server",
      [paths.tempTestfileDir],
      paths.serverTestDependencies(),
      function(complete, fail) {
        console.log("Testing server JavaScript: ");
        mochaRunner().runTests(
          {
            files: paths.serverTestFiles(),
            options: mochaConfig()
          },
          complete,
          fail
        );
      }
    );

    incrementalTask(
      "sharedOnServer",
      [],
      paths.sharedJsTestDependencies(),
      function(complete, fail) {
        console.log("Testing shared JavaScript on server: ");
        mochaRunner().runTests(
          {
            files: paths.sharedTestFiles(),
            options: mochaConfig()
          },
          complete,
          fail
        );
      }
    );

    incrementalTask(
      "sharedOnClient",
      [],
      paths.sharedJsTestDependencies(),
      function(complete, fail) {
        console.log("Testing shared JavaScript on client: ");
        runKarmaOnTaggedSubsetOfTests("SHARED", complete, fail);
      }
    );

    incrementalTask("clientUi", [], paths.clientJsTestDependencies(), function(
      complete,
      fail
    ) {
      console.log("Testing browser UI code: ");
      runKarmaOnTaggedSubsetOfTests("UI", complete, fail);
    });

    incrementalTask("testClientCss", [], paths.cssTestDependencies(), function(
      complete,
      fail
    ) {
      console.log("Testing CSS:");
      runKarmaOnTaggedSubsetOfTests("CSS", complete, fail);
    });
  });

  desc("End-to-end smoke tests");
  task(
    "smoke",
    ["build:all"],
    function() {
      console.log("Smoke testing app: ");
      mochaRunner().runTests(
        {
          files: paths.smokeTestFiles(),
          options: mochaConfig()
        },
        complete,
        fail
      );
    },
    { async: true }
  );
});

function incrementalTask(taskName, taskDependencies, fileDependencies, action) {
  const incrementalFile = paths.incrementalDir + "/" + taskName + ".task";
  task(
    taskName,
    taskDependencies.concat(paths.incrementalDir, incrementalFile)
  );
  file(
    incrementalFile,
    fileDependencies,
    function() {
      action(succeed, fail);
    },
    { async: true }
  );

  function succeed() {
    fs().writeFileSync(incrementalFile, "ok");
    complete();
  }
}

function runKarmaOnTaggedSubsetOfTests(tag, complete, fail) {
  karmaRunner().run(
    {
      configFile: paths.karmaConfig,
      expectedBrowsers: testedBrowsers(),
      strict: strict,
      clientArgs: ["--grep=" + tag + ":"]
    },
    complete,
    fail
  );
}

function fs() {
  return require("fs");
}

function karmaRunner() {
  return require("simplebuild-karma");
}

function mochaConfig() {
  return require("../config/mocha.conf.js");
}

function mochaRunner() {
  return require("./utils//mocha_runner.js");
}

function testedBrowsers() {
  return require("../config/tested_browsers.js");
}
