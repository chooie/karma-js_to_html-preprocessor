const child_process = require("child_process");
const fs = require("fs");
const procfile = require("procfile");

exports.runInteractively = function(configuration) {
  return run(configuration, "inherit");
};

exports.runProgrammatically = function(configuration, callback) {
  const serverProcess = runOnlyWithStdErr(configuration);

  serverProcess.stdout.setEncoding("utf8");
  serverProcess.stdout.on("data", function(chunk) {
    if (chunk.trim().indexOf("Server started") !== -1) {
      callback(serverProcess);
    }
  });
};

function runOnlyWithStdErr(configuration) {
  const serverProcess = run(configuration, ["pipe", "pipe", process.stderr]);
  return serverProcess;
}

function run(configuration, stdioOptions) {
  const commandLine = parseProcFile(configuration.port);
  return child_process.spawn(commandLine.command, commandLine.options, {
    stdio: stdioOptions
  });
}

function parseProcFile(defaultPort) {
  const fileData = fs.readFileSync("Procfile", "utf8");
  const webCommand = procfile.parse(fileData).web;
  webCommand.options = webCommand.options.map(function(element) {
    if (element === "$PORT") return defaultPort;
    else return element;
  });
  return webCommand;
}
