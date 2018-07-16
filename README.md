# Karma JS to HTML PreProcessor
Karma plugin for @chooie/js\_to\_html

## Development
View the available tasks to run

### Run on your local machine

``` bash
./tasks.sh
```

### Run within Docker

```bash
./docker-tasks.sh
```

### Quickstart

- Install docker (I'm running 18.03.0-ce-mac60)
- Start the Karma server

    ```bash
    ./docker-tasks.sh karma
    ```
- Capture the browsers you want to test by visiting http://localhost:9876
- Run all the checks

    ```bash
    ./docker-tasks.sh test:all
    ```
- Start the application

    ```bash
    ./docker-tasks.sh run
    ```

## Setup
### Frontend testing requirements
In order to perform cross-browser testing professionally, we must test our
application in real browsers. The testing infrastructure checks that the
expected browsers are tested. You will need to install the necessary browsers
and run the necessary emulators(or test loosely - see the error message).

I recommend that you test all browsers/platforms that you intend to serve
as part of the automated testing.

With this in place, make sure to start the karma server and capture each of
the browsers you would like to test by visiting http://localhost:9876 (may
differ if you are in an emulator - read the docs for that environment).

## Gotchas
When limiting the mocha tests that you want to run with `.skip()` or `.only()`,
make sure to use the `test:quick` task first to get a passing suite (WITH NO
LIMITS SPECIFIED YET). Then limit your tests and run `test:quick` again.

There is something weird going on with our jake test tasks, mocha, and/or karma
that is stopping this from working properly (like with `test:all`).

## Credits
  Much of the inspiration and implementation is borrowed from James Shore
  (https://github.com/jamesshore). I highly recommend his webseries Let's Code
  Test Driven Javascript (http://www.letscodejavascript.com/).
