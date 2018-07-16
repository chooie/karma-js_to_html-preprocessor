const util = require("./util.js");

exports.convert = function toHtml(structureToConvert) {
  const htmlToReturn =
    "\n<!DOCTYPE html>\n" + convertElementToHtml(0, structureToConvert);
  return htmlToReturn;
};

exports.__express = function __express(filePath, options, callback) {
  const jsPage = require(filePath);
  checkPageIsCorrectlySetup(jsPage, filePath);

  const content = jsPage.page(options);

  if (!Array.isArray(content)) {
    throw new Error(makeContextualErrorMessage(content, filePath));
  }

  const generatedHtml = exports.convert(content);
  return callback(null, generatedHtml);
};

exports.checkPageIsCorrectlySetup = checkPageIsCorrectlySetup;
function checkPageIsCorrectlySetup(jsPage, filePath) {
  if (!jsPage.page) {
    throw new Error(`exports.page must be set at ${filePath}`);
  }

  if (typeof jsPage.page !== "function") {
    throw new Error(makeContextualErrorMessage(exports.page, filePath));
  }
}

exports.makeContextualErrorMessage = makeContextualErrorMessage;
function makeContextualErrorMessage(content, filePath) {
  const errorMessage = util.stripMargin`
          |exports.page must be set to a function(options: Object) that returns
          |an array that conforms to the @chooie/js_to_html structure as
          |documented at 'https://github.com/chooie/js_to_html'.`;

  return util.stripMargin`
    |${errorMessage}
    |Got '${content}' of type ${typeof content}. Issue found in file
    |'${filePath}'.`;
}

function convertElementToHtml(indentLevel, elementArray, arrayContext) {
  if (!Array.isArray(elementArray)) {
    const dataString = JSON.stringify(elementArray, null, 2);
    const dataType = typeof elementArray;
    throw new Error(
      `Expected an element array but got '${dataString}' of type '${dataType}'.`
    );
  }
  if (isEmpty(elementArray)) {
    let errorMessage = "\nEmpty arrays are not a valid input.";

    if (arrayContext) {
      const contextString = JSON.stringify(arrayContext, null, 2);
      errorMessage += `\nContext: ${contextString}\n`;
    }

    throw new Error(errorMessage);
  }
  if (isAnEmptyElement(elementArray)) {
    return handleEmptyElement(indentLevel, elementArray);
  } else {
    return handleNestedElement(indentLevel, elementArray);
  }
}

function isEmpty(array) {
  return array.length === 0;
}

function isAnEmptyElement(elementArray) {
  return (
    elementArray.length === 1 || isAnEmptyElementWithAttributes(elementArray)
  );

  function isAnEmptyElementWithAttributes(elementArray) {
    const secondElement = second(elementArray);
    elementArray.length === 2 &&
      secondElement &&
      typeof secondElement === "object" &&
      !Array.isArray(elementArray);
  }
}

function handleEmptyElement(indentLevel, elementArray) {
  const elementTag = first(elementArray);
  return makeStringElement(elementTag, indentLevel);
}

function handleNestedElement(indentLevel, elementArray) {
  const elementTag = first(elementArray);
  let remainingElements = rest(elementArray);
  const firstRemaining = first(remainingElements);
  let accumulatedString = fillWhiteSpace(indentLevel) + `<${elementTag}`;

  if (typeof firstRemaining === "object" && !Array.isArray(firstRemaining)) {
    remainingElements = rest(remainingElements);
    const keys = Object.keys(firstRemaining);
    keys.forEach(function(key) {
      accumulatedString += " " + key + '="' + firstRemaining[key] + '"';
    });
  }

  accumulatedString += ">\n";
  accumulatedString += convertElementsToHtml(
    accumulatedString,
    remainingElements,
    indentLevel,
    elementArray
  );
  return accumulatedString + fillWhiteSpace(indentLevel) + `</${elementTag}>\n`;
}

function convertElementsToHtml(
  accumulatedString,
  remainingElements,
  indentLevel,
  arrayContext
) {
  return remainingElements.reduce(function(accumulatedString, element) {
    if (typeof element === "string") {
      return (
        accumulatedString + fillWhiteSpace(indentLevel + 2) + element + "\n"
      );
    }
    return (
      accumulatedString +
      convertElementToHtml(indentLevel + 2, element, arrayContext)
    );
  }, "");
}

function makeStringElement(elementTag, indentLevel, innerElement) {
  if (!innerElement) innerElement = "";
  return (
    fillWhiteSpace(indentLevel) +
    `<${elementTag}>` +
    innerElement +
    `</${elementTag}>\n`
  );
}

function fillWhiteSpace(indentLevel) {
  return " ".repeat(indentLevel);
}

function first(array) {
  return array[0];
}

function second(array) {
  return array[1];
}

function rest(array) {
  return array.slice(1);
}
