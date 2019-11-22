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
    "should navigate to matrix manager": browser => {
      console.log("Browser Launch URL", browser.launch_url);
      browser.url(browser.launch_url + "matrices").resizeWindow(1366, 768);
      browser.url(function(result) {
        console.log("Current URL", result);
      });
    },
    "should authenticate": browser => {
      const loginPage = browser.page.Login();

      loginPage.isOnPage().loginAs(TEST_USER, TEST_PASS);
    },
    "should redirect to matrix manager": browser => {
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

      createMatrixDialog.fillsInPIBControlNumber("20191235R");
      createMatrixDialog.fillsInFirstReviewer("jacob.gacek@thoughtworks.com");
      createMatrixDialog.fillsInSecondReviewer("wyao@thoughtworks.com");
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
