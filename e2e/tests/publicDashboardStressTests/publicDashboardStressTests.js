module.exports = {
  before: browser => {
    // Check on Connection Count
    console.log("Browser Launch URL", browser.launch_url);
    browser.url(browser.launch_url).resizeWindow(1366, 768);
    browser.url(function (result) {
      console.log("Current URL", result);
    });

    const publicDataDashboardPage = browser.page.publicDataDashboard.PublicDataDashboard();
    publicDataDashboardPage.isOnPage(browser);
  },

  "wait for visualizations": browser => {
    browser.pause(10000);
  },

  "end user journey ;)": browser => {
    browser.end();
  }
};
