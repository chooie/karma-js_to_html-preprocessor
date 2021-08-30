exports.getConfig = function getConfig(environment) {
  const validEnvironments = ["production", "development", "automated testing"];

  if (!validEnvironments.includes(environment)) {
    throw Error(
      `Invalid environment '${environment}. Expected one of ${validEnvironments}`
    );
  }

  if (environment === "development") {
    return {
      port: 5000
    };
  } else if (environment === "automated testing") {
    return {
      port: 4999
    };
  } else {
    if (!process.env.PORT) {
      throw Error("You must set PORT environment variable!");
    }
    return {
      port: process.env.PORT
    };
  }
};
