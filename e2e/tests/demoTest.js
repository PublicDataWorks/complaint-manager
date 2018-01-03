module.exports = {
  'Demo test' : function (browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('h2[data-test="pageTitle"]', 1000)
      .assert.title('Complaint Manager')
      .end();
  }
};
