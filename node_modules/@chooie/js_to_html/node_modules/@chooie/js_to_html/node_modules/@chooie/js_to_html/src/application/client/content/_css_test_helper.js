var quixote = require("./vendor/quixote-0.14.0.js");
var assert = require("_assert");

exports.smallestDeviceWidth = 320;
exports.mediumDeviceWidth = 640;
exports.maximumPageWidth = 800;

const contentDir = "/base/src/application/client/content";

exports.setupUnitTests = function setupUnitTests() {
  before(function(done) {
    exports.frame = exports.createFrame(
      {
        width: exports.smallestDeviceWidth,
        stylesheet: [
          `${contentDir}/styles/vendor/normalize-3.0.2.css`,
          `${contentDir}/styles/main.css`
        ]
      },
      done
    );
  });

  beforeEach(function() {
    exports.frame.reset();
  });

  after(function() {
    exports.frame.remove();
  });
};

exports.createFrame = function createFrame(options, callback) {
  return quixote.createFrame(options, callback);
};

exports.getBackgroundColor = function backgroundColor(element) {
  return normalizeColorString(element.getRawStyle("background-color"));
};

exports.fontFamily = function fontFamily(element) {
  var family = element.getRawStyle("font-family");
  family = family.replace(/"/g, "");

  var fonts = family.split(",");
  for (var i = 0; i < fonts.length; i++) {
    fonts[i] = trim(fonts[i]);
  }

  return fonts.join(", ");
};

exports.textAlign = function textAlign(element) {
  return element.getRawStyle("text-align");
};

exports.fontWeight = function fontWeight(element) {
  var weight = element.getRawStyle("font-weight");
  if (weight === "normal") weight = "400";
  return weight.toString();
};

exports.fontSize = function fontSize(element) {
  forceBrowserReflow(element.toDomElement());
  return element.getRawStyle("font-size");
};

exports.textColor = function textColor(element) {
  return normalizeColorString(element.getRawStyle("color"));
};

exports.roundedCorners = function roundedCorners(element) {
  return getCompoundStyle(
    element,
    "border-top-left-radius",
    "border-top-right-radius",
    "border-bottom-left-radius",
    "border-bottom-right-radius"
  );
};

exports.margin = function margin(element) {
  return getCompoundStyle(
    element,
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left"
  );
};

exports.padding = function padding(element) {
  return getCompoundStyle(
    element,
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left"
  );
};

exports.under = function under(element, relativeToElement) {
  var elementZ = getZIndex(element);
  var relativeZ = getZIndex(relativeToElement);

  if (elementZ === relativeZ) {
    return !isElementAfterElementInDomTree();
  } else {
    return elementZ < relativeZ;
  }

  function getZIndex(element) {
    var z = element.getRawStyle("z-index");
    if (z === "auto") z = 0;
    return z;
  }

  function isElementAfterElementInDomTree() {
    var elementNode = element.toDomElement();
    var relativeNode = relativeToElement.toDomElement();

    var foundRelative = false;
    var elementAfterRelative = false;
    for (
      var child = elementNode.parentNode.firstChild;
      child !== null;
      child = child.nextSibling
    ) {
      if (child === elementNode) {
        if (foundRelative) elementAfterRelative = true;
      }
      if (child === relativeNode) foundRelative = true;
    }
    if (!foundRelative) {
      throw new Error(
        "Can't yet compare elements that have same z-index " +
          "and are not siblings"
      );
    }
    return elementAfterRelative;
  }
};

exports.backgroundImage = function backgroundImage(element) {
  var url = element.getRawStyle("background-image");

  var parsedUrl = stripOffDomain(url);
  if (parsedUrl === null) throw new Error("could not parse URL: " + url);

  return parsedUrl[2];

  function stripOffDomain(url) {
    var parsedUrl = url.match(/^url\("?http:\/\/(.+?)(\/.*?)"?\)$/);
    return parsedUrl;
  }
};

exports.backgroundPosition = function backgroundImage(element) {
  var position = element.getRawStyle("background-position");

  if (position === "" || position === "50%" || position === "50% 50%") {
    return "center";
  } else {
    return position;
  }
};

exports.hasBorder = function hasBorder(element) {
  var top = element.getRawStyle("border-top-style");
  var right = element.getRawStyle("border-right-style");
  var bottom = element.getRawStyle("border-bottom-style");
  var left = element.getRawStyle("border-left-style");
  return !(
    top === "none" &&
    right === "none" &&
    bottom === "none" &&
    left === "none"
  );
};

exports.isTextVerticallyCentered = function isTextVerticallyCentered(element) {
  var elementHeight = Math.round(element.getRawPosition().height);
  return elementHeight + "px" === exports.lineHeight(element);
};

exports.lineHeight = function lineHeight(element) {
  return element.getRawStyle("line-height");
};

exports.dropShadow = function dropShadow(element) {
  var shadow = element.getRawStyle("box-shadow");

  // When there is no drop shadow, most browsers say 'none', but IE 9 gives a
  // color and nothing else. We handle that case here.
  if (shadow === "white") return "none";
  if (isHexString(shadow)) return "none";

  // The standard value seems to be "rgb(r, g, b) Wpx Xpx Ypx Zpx",
  // but IE 9 gives us "Wpx Xpx Ypx Zpx #rrggbb". We need to normalize it.
  // BTW, we don't support multiple shadows yet

  // get everything before the '#' and the r, g, b
  var groups = shadow.match(/^([^#]+) (#......)/);
  if (groups === null) {
    // There was no '#', so we assume we're not on IE 9 and everything's fine
    return shadow;
  }

  return normalizeColorString(groups[2]) + " " + groups[1];

  function isHexString(shadow) {
    shadow.match(/^#[0-9a-f]{6}$/);
  }
};

exports.textIsUnderlined = function textIsUnderlined(element) {
  var style = element.getRawStyle("text-decoration");
  return style.indexOf("none") !== 0;
};

exports.textIsUppercase = function textIsUppercase(element) {
  return element.getRawStyle("text-transform") === "uppercase";
};

exports.opacity = function opacity(element) {
  return element.getRawStyle("opacity");
};

exports.assertHoverStyle = function assertHoverStyle(
  button,
  expectedColor,
  description
) {
  applyClass(button, "_hover_", function() {
    assert.equal(
      exports.backgroundColor(button),
      expectedColor,
      description + " hover state background color"
    );
  });
};

exports.assertActivateDepresses = function assertActivateDepresses(
  button,
  expectedDescriptor,
  description
) {
  applyClass(button, "_active_", function() {
    button.assert(
      {
        top: expectedDescriptor
      },
      description
    );
    assert.equal(exports.dropShadow(button), "none", description);
  });
};

function applyClass(element, className, fn) {
  var domElement = element.toDomElement();
  var oldClassName = domElement.className;
  try {
    domElement.className += " " + className;
    forceReflow(domElement);

    fn();
  } finally {
    domElement.className = oldClassName;
    forceReflow(domElement);
  }
}

function forceReflow(domElement) {
  domElement.offsetHeight;
}

function getCompoundStyle(element, subStyle1, subStyle2, subStyle3, subStyle4) {
  // We can't look at compound properties directly because they return "" on
  // Firefox and IE 9
  var one = element.getRawStyle(subStyle1);
  var two = element.getRawStyle(subStyle2);
  var three = element.getRawStyle(subStyle3);
  var four = element.getRawStyle(subStyle4);

  var result;
  if (one === two && one === three && one === four) {
    result = one;
  } else {
    result = one + " " + two + " " + four + " " + three;
  }
  return result;
}

// Based on MDN code at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
function trim(str) {
  var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  return str.replace(rtrim, "");
}

function normalizeColorString(color) {
  if (color === "white") return "rgb(255, 255, 255)";
  if (color === "transparent") return "rgba(0, 0, 0, 0)";

  // look for presence of #rrggbb string
  var colorGroups = color.match(/^#(..)(..)(..)/);
  // if doesn't match, assume we have rgb() string
  if (colorGroups === null) return color;

  var r = parseInt(colorGroups[1], 16);
  var g = parseInt(colorGroups[2], 16);
  var b = parseInt(colorGroups[3], 16);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function forceBrowserReflow(element) {
  element.offsetHeight;
}
