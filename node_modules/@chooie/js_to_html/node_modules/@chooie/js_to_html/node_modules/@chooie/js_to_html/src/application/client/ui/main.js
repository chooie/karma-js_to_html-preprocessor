const foo = require("./foo.js");

exports.isTrue = function() {
  return true;
};

exports.sayHey = function() {
  foo.hey();
};
