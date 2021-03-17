const chromedriver = require("chromedriver");
const selenium = require("selenium-server");

const {
  ADD_CIVILIAN_WITHIN_PD,
  SEARCH_CIVILIAN_WITHIN_PD,
  ORGANIZATION,
  INSTANCE_CIVILIAN_WITHIN_PD_TITLE
} = require("../../constants");

module.exports = {
  src_folders: ["./e2e/tests"],
  output_folder: "reports",
  custom_commands_path: "",
  custom_assertions_path: "",
  page_objects_path: "./e2e/pageObjectModels",
  globals_path: "",
  webdriver: {
    start_process: true,
    server_path: chromedriver.path,
    port: 9515,
    cli_args: ["--log", "debug"]
  },
  test_settings: {
    default: {
      launch_url: "",
      silent: true,
      screenshots: {
        enabled: true,
        path: "./e2e/tests",
        on_failure: true,
        on_error: true
      },
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          args: ["--headless", "--no-sandbox"]
        }
      },
      persist_globals: true,
      globals: {
        current_case: "",
        added_civilian_success: `${INSTANCE_CIVILIAN_WITHIN_PD_TITLE} was successfully added`,
        decline_complaint_letter_section: `${ORGANIZATION} declines to classify the complaint at this time.`,
        pd_address: "Location: Bourbon St & Canal St, New Orleans, LA 70112",
        add_civilian: ADD_CIVILIAN_WITHIN_PD,
        search_civilian: SEARCH_CIVILIAN_WITHIN_PD,
        organization: ORGANIZATION
      }
    },
    local: {
      globals: {
        disableAuthentication: true
      },
      launch_url: "https://app-e2e/",
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          args: ["--headless", "--no-sandbox", "--ignore-certificate-errors"]
        }
      }
    },
    ci: {
      launch_url: "https://noipm-ci.herokuapp.com/"
    },
    staging: {
      launch_url: "https://noipm-staging.herokuapp.com/"
    }
  }
};
