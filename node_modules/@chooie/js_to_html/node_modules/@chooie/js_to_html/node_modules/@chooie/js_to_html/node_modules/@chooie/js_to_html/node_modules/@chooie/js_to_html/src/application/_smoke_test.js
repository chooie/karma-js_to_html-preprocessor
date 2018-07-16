const assert = require("_assert");
const chrome = require("selenium-webdriver/chrome");
const http = require("http");
const https = require("https");
const webdriver = require("selenium-webdriver");

const By = webdriver.By;

const config = require("./server/config.js").getConfig("automated testing");
const runServer = require("./_run_server.js");

const HOME_PAGE_URL = `http://localhost:${config.port}`;
const UNKNOWN_ROUTE = `${HOME_PAGE_URL}/not-a-known-route`;
const EXPECTED_BROWSER = "chrome";

describe("Smoke test", function() {
  this.timeout(5 * 1000);

  let serverProcess;
  let driver;

  before(function(done) {
    runServer.runProgrammatically(config, function(process) {
      serverProcess = process;

      try {
        driver = createDriver();
        driver
          .getCapabilities()
          .then(function(capabilities) {
            const version = capabilities.get("browserName");
            if (version !== EXPECTED_BROWSER) {
              console.log(
                "Warning: Smoke test browser expected " +
                  EXPECTED_BROWSER +
                  ", but was " +
                  version
              );
            }
          })
          .catch(function(err) {
            console.log(err);
          })
          .then(done);
      } catch (error) {
        throw error;
      }
    });
  });

  after(function(done) {
    serverProcess.on("exit", function(code, signal) {
      driver
        .quit()
        .then(function() {})
        .catch(function(error) {
          console.log(error);
        })
        .then(done);
    });
    serverProcess.kill();
  });

  it("can get home page", async function() {
    let { receivedData } = await httpGet(HOME_PAGE_URL);
    const marker = "App home page";
    const foundHomePage = receivedData.indexOf(marker) !== -1;

    assert.equal(
      foundHomePage,
      true,
      `home page should have contained test marker '${marker}'`
    );
  });

  it("can find the header", async function() {
    await driver.get(HOME_PAGE_URL);
    const elements = await driver.findElements(By.id("header-text"));
    const element = elements[0];
    const text = await element.getText();
    assert.equal(text, "Hello, world!");
    assert.equal(await driver.getTitle(), "Home - Automatopia NodeJS");
  });

  it("can get 404 page when using an unknown route", async function() {
    let { receivedData } = await httpGet(UNKNOWN_ROUTE);
    const marker = "App 404 page";
    const didFind404Page = receivedData.indexOf(marker) !== -1;

    assert.equal(
      didFind404Page,
      true,
      `404 page should have contained test marker '${marker}'`
    );
  });

  it("has correct title for 404 page", async function() {
    await driver.get(UNKNOWN_ROUTE);
    assert.equal(
      await driver.getTitle(),
      "Page Not Found - Automatopia NodeJS"
    );
  });
});

function createDriver() {
  require("chromedriver");
  const options = new chrome.Options();
  options.addArguments("headless", "disable-gpu", "no-sandbox");

  return new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

function httpGet(url) {
  return new Promise(function(resolve, reject) {
    let request;

    if (url.startsWith("http://")) {
      request = http.get(url);
    } else if (url.startsWith("https://")) {
      request = https.get(url);
    } else {
      throw new Error(`Expected url to beging with http(s) but got ${url}`);
    }

    request.on("response", function(response) {
      let receivedData = "";
      response.setEncoding("utf8");

      response.on("data", function(chunk) {
        receivedData += chunk;
      });
      response.on("end", function() {
        resolve({ response, receivedData });
      });
    });
  });
}
