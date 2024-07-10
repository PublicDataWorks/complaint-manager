const { defineConfig } = require("cypress");
module.exports = defineConfig({
  env: {
    url_okta_hawaii: "https://dev-68895481.okta.com/",
    url_hawaii: "https://hcsoc-staging-0171a859e889.herokuapp.com",
    username_hawaii: "pdm@publicdata.works",
    password_hawaii: "",
    url_auth0_noipm: "https://noipm-staging.auth0.com",
    url_noipm: "https://noipm-staging.herokuapp.com",
    username_noipm: "vwong@thoughtworks.com",
    password_noipm: ""
  },
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack"
    }
  },
  e2e: {
    defaultCommandTimeout: 3000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalOriginDependencies: true
  },
});