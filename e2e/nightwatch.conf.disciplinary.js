const chromedriver = require("chromedriver");
const selenium = require("selenium-server");

const config = {
  src_folders: ["e2e/tests/matrixManager"],
  output_folder: "reports",
  custom_commands_path: "",
  custom_assertions_path: "",
  page_objects_path: "./e2e/pageObjectModels",
  globals_path: "",
  webdriver: {
    start_process: true,
    server_path: chromedriver.path,
    port: 9515,
    log_path: "",
    cli_args: ["--log", "debug"]
  },
  test_settings: {
    default: {
      launch_url: "localhost:3000/",
      silent: true,
      screenshots: {
        enabled: true,
        path: "./e2e/tests",
        on_failure: true,
        on_error: true
      },
      desiredCapabilities: {
        browserName: "chrome",
        // To run without headless, remove the '--headless' flag and add 'start-fullscreen'
        chromeOptions: {
          args: ["--headless", "--no-sandbox"]
        }
      }
    }
  }
};

module.exports = config;
