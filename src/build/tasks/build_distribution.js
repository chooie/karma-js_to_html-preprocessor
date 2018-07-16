/*global namespace, desc, task, fail, complete*/
const paths = require("../config/paths.js");

namespace("build", function() {
  desc("Bundle and build code");
  task("all", ["server", "client"]);

  task("server", [paths.buildServerDir, paths.buildSharedDir], function() {
    console.log("Collating server files: .");

    shell().rm("-rf", paths.buildDir + "/server/*");
    shell().rm("-rf", paths.buildDir + "/shared/*");
    shell().rm("-rf", paths.buildDir + "/node_modules/*");
    shell().cp(
      "-R",
      "src/application/server",
      "src/application/shared",
      "src/application/node_modules",
      paths.buildDir
    );
  });

  task("client", ["collateClientFiles", "bundleClientJs"]);

  task("collateClientFiles", [paths.buildClientDir], function() {
    console.log("Collating client files: .");

    shell().rm("-rf", paths.buildClientDir + "/*");
    shell().cp(
      "-R",
      "src/application/client/content/*",
      "src/application/client/ui/vendor",
      paths.buildClientDir
    );
  });

  task(
    "bundleClientJs",
    [paths.buildClientDir],
    function() {
      process.stdout.write("Bundling client files with Browserify: ");

      const browserifyRunner = require("./utils/browserify_runner.js");
      browserifyRunner.bundle(
        {
          requires: [
            {
              path: "./src/application/client/ui/main.js",
              expose: "./main.js"
            }
          ],
          outfile: paths.buildClientDir + "/bundle.js",
          options: { debug: true }
        },
        complete,
        fail
      );
    },
    { async: true }
  );
});

function shell() {
  return require("shelljs");
}
