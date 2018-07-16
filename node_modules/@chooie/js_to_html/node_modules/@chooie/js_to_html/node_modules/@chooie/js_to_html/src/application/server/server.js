const httpServer = require("./http_server.js");

exports.make = function server() {
  let server;

  return {
    async start(portNumber, contentDir, notFoundPageToServe) {
      if (!portNumber) throw new Error("port number is required");

      server = httpServer.make(portNumber, contentDir, notFoundPageToServe);
      await server.start(portNumber);
    },

    async stop() {
      if (server === undefined) {
        throw new Error("stop() called before server started");
      }

      await server.stop();
    }
  };
};
