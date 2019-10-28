const path = require("path");

const TEST_USER = process.env.TEST_USER;
const TEST_PASS = process.env.TEST_PASS;
const HOST = process.env.HOST;

if (!TEST_PASS) {
  console.log("Set the password in the ENV VAR 'TEST_PASS' for login");
  process.exit(1);
}
if (!TEST_USER) {
  console.log("Set the username in the ENV VAR 'TEST_USER' for login");
  process.exit(1);
}
if (!HOST) {
  console.log("Set the host in the ENV VAR 'HOST' for login");
  process.exit(1);
}

if (TEST_PASS && TEST_USER && HOST) {
  module.exports = {
    "should navigate to disciplinary proceedings": browser => {
      browser.url(HOST + "disciplinary-proceedings");
      browser.url(function(result) {
        console.log("URL:", result);
      });
    },
    "should authenticate": browser => {
      const loginPage = browser.page.Login();

      loginPage.isOnPage().loginAs(TEST_USER, TEST_PASS);
    },
    "should redirect to disciplinary proceedings": browser => {
      const matrixList = browser.page.MatrixList();

      matrixList.isOnPage();
    },
    // TODO: Add create matrix dialog to e2e test
    // "should find someone in user drop down": browser => {
    //   const matrixList = browser.page.MatrixList();
    //
    //   matrixList.displaysUserDropDown();
    // },
    "should open gear menu and click into complaints": browser => {
      const navBar = browser.page.NavBar();
      const caseDashboard = browser.page.CaseDashboard();
      navBar.goToComplaints();

      caseDashboard.isOnPage();
    },
    "end user journey ;)": browser => {
      browser.end();
    }
  };
}
