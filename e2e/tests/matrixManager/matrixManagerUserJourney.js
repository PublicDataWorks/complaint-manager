const TEST_USER = process.env.TEST_USER;
const TEST_PASS = process.env.TEST_PASS;

if (!TEST_PASS) {
  console.log("Set the password in the ENV VAR 'TEST_PASS' for login");
  process.exit(1);
}
if (!TEST_USER) {
  console.log("Set the username in the ENV VAR 'TEST_USER' for login");
  process.exit(1);
}

if (TEST_PASS && TEST_USER) {
  module.exports = {
    before: browser => {
      console.log("Browser Launch URL", browser.launch_url);
      browser.url(browser.launch_url + "matrices").resizeWindow(1366, 768);
      browser.url(function(result) {
        console.log("Current URL", result);
      });

      const loginPage = browser.page.Login();

      loginPage.isOnPage().loginAs(TEST_USER, TEST_PASS);

      const matrixList = browser.page.MatrixList();

      matrixList.isOnPage();
    },

    "should open create matrix dialog": browser => {
      const matrixList = browser.page.MatrixList();
      const createMatrixDialog = browser.page.CreateMatrixDialog();

      matrixList.pressesCreateMatrixButton();
      createMatrixDialog.dialogIsOpen();
    },
    "should create matrix": browser => {
      const createMatrixDialog = browser.page.CreateMatrixDialog();
      const snackbar = browser.page.SnackbarPOM();

      const min = 10000000;
      const max = 99999999;
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      const pibControlNumber = `${num}R`;
      createMatrixDialog.fillsInPIBControlNumber(pibControlNumber);
      createMatrixDialog.fillsInFirstReviewer();
      createMatrixDialog.fillsInSecondReviewer();
      createMatrixDialog.clicksCreateButton();

      snackbar.presentWithMessage("Matrix was successfully created").close();
    },
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
