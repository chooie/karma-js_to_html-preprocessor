(async function() {
  const server = require("./server.js");

  const CONTENT_DIR = "./generated/dist/client";

  const port = process.argv[2];
  const theServer = server.make();

  await theServer.start(port, CONTENT_DIR, "404.html");
  console.log(`Server started on port '${port}'`);
})();
