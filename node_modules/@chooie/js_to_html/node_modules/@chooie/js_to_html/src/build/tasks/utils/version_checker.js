const semver = require("semver");

exports.check = function(options, success, failCallback) {
  if (options.strict) {
    failIfVersionsAreNotExactlyEqual(options, failCallback);
  } else {
    checkVersionsNonStrictly(options, failCallback);
  }
  return success();
};

function failIfVersionsAreNotExactlyEqual(options, failCallback) {
  if (versionsAreNotEqual(options.expected, options.actual)) {
    failWithQualifier(options, "exactly", failCallback);
  }
}

function checkVersionsNonStrictly(options, failCallback) {
  if (expectedVersionIsLessThanActual(options.actual, options.expected)) {
    return failWithQualifier(options, "at least", failCallback);
  }
  if (versionsAreNotEqual(options.actual, options.expected)) {
    console.log(
      `Warning: Newer ${options.name} version than expected. Expected ${
        options.expected
      }, but was ${options.actual}.`
    );
  }
}

function versionsAreNotEqual(actual, expected) {
  return semver.neq(actual, expected);
}

function expectedVersionIsLessThanActual(actual, expected) {
  return semver.lt(actual, expected);
}

function failWithQualifier(options, qualifier, failCallback) {
  return failCallback(
    `Incorrect ${options.name} version. Expected qualifier ${
      options.expected
    }, but was ${options.actual}.`
  );
}
