const glob = require("glob");
const path = require("path");

const e = exports;

e.generatedDir = "generated";
e.tempTestfileDir = `${e.generatedDir}/test`;
e.incrementalDir = `${e.generatedDir}/incremental`;
e.buildDir = `${e.generatedDir}/dist`;
e.buildServerDir = `${e.buildDir}/server`;
e.buildSharedDir = `${e.buildDir}/shared`;
e.buildClientDir = `${e.buildDir}/client`;
e.buildClientIndexHtml = `${e.buildDir}/client/index.html`;
e.buildClient404Html = `${e.buildDir}/client/404.html`;
e.buildIntermediateFilesToErase = function() {
  return deglob([
    `${e.buildDir}/client/_*`,
    `${e.buildDir}/client/bundle.js`,
    `${e.buildDir}/client/screen.css`
  ]);
};

e.applicationSrc = "src/application";
e.karmaConfig = "src/build/config/karma.conf.js";

e.serverTestFiles = function() {
  return deglob(`${e.applicationSrc}/server/**/_*_test.js`);
};

e.sharedTestFiles = function() {
  return deglob([
    `${e.applicationSrc}/shared/**/_*_test.js`,
    `${e.applicationSrc}/node_modules/**/_*_test.js`
  ]);
};

e.cssTestDependencies = function() {
  return deglob([
    `${e.applicationSrc}/client/content/**/*`,
    `${e.applicationSrc}/node_modules/**/*.js`
  ]);
};

e.clientJsTestDependencies = function() {
  return deglob([
    `${e.applicationSrc}/client/ui/**/*.js`,
    `${e.applicationSrc}/shared/**/*.js`,
    `${e.applicationSrc}/node_modules/**/*.js`
  ]);
};

e.sharedJsTestDependencies = function() {
  return deglob([
    `${e.applicationSrc}/shared/**/*.js`,
    `${e.applicationSrc}/node_modules/**/*.js`
  ]);
};

e.clientNetworkTestDependencies = function() {
  return deglob([
    `${e.applicationSrc}/client/network/**/*.js`,
    `${e.applicationSrc}/shared/**/*.js`,
    `${e.applicationSrc}/node_modules/**/*.js`
  ]);
};

e.serverTestDependencies = function() {
  return deglob([
    `${e.applicationSrc}/server/**/*.js`,
    `${e.applicationSrc}/shared/**/*.js`,
    `${e.applicationSrc}/node_modules/**/*.js`
  ]);
};

e.smokeTestFiles = function() {
  return deglob(`${e.applicationSrc}/_*_test.js`);
};

e.lintFiles = function() {
  return deglob(
    ["*.js", `${e.applicationSrc}/**/*.js`, "src/build/**/*.js"],
    ["**/vendor/*.js"]
  );
};

e.lintOutput = function() {
  return e.lintFiles().map(function(pathname) {
    return `${e.generatedDir}/incremental/lint/${pathname}.lint`;
  });
};

e.lintDirectories = function() {
  return e.lintOutput().map(function(lintDependency) {
    return path.dirname(lintDependency);
  });
};

function deglob(patternsToFind, patternsToIgnore) {
  let globPattern = patternsToFind;
  if (Array.isArray(patternsToFind)) {
    if (patternsToFind.length === 1) {
      globPattern = patternsToFind[0];
    } else {
      globPattern = "{" + patternsToFind.join(",") + "}";
    }
  }

  return glob.sync(globPattern, { ignore: patternsToIgnore });
}
