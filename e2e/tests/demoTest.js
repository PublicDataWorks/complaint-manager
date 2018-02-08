module.exports = {
  'should see sign-in title' : function (browser) {
    browser
        .url("https://noipm-staging.herokuapp.com")
        .waitForElementVisible("body", 3000)
        .verify.title('Sign In with Auth0')
      .end();
  }
};
