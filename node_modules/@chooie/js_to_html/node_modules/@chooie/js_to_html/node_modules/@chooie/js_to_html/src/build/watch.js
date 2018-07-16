const nodemon = require("nodemon");
const paths = require("./config/paths.js");

const command = "./tasks.sh";

console.log(
  `*** Using nodemon to run ${command}. Type 'rs<enter>' to force restart.`
);
nodemon({
  ext: "sh bat json js html css",
  ignore: paths.generatedDir,
  exec: command + " " + process.argv.slice(2).join(" "),
  execMap: {
    sh: "/bin/sh"
  }
}).on("restart", function(files) {
  console.log("*** Restarting due to", files);
  console.log(">");
  console.log(">");
  console.log(">");
});
