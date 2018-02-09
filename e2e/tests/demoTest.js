const TEST_USER = process.env.TEST_USER
const TEST_PASS = process.env.TEST_PASS
const HOST = process.env.HOST

if(!TEST_PASS){
    console.log("Set the password in the ENV VAR 'TEST_PASS' for login")
}
if(!TEST_USER){
    console.log("Set the username in the ENV VAR 'TEST_USER' for login")
}

module.exports = {
    "should see sign-in title": (browser) => {
        browser
            .url(HOST)
            .waitForElementVisible("body", 3000)
            .verify.title("Sign In with Auth0")
    },

    "should log-in and authenticate test user": (browser) => {
        browser
            .waitForElementVisible("[name=email]", 1000)
            .setValue("[name=email]", TEST_USER)
            .setValue("[name=password]", TEST_PASS)
            .click('button[type=submit]')
            .waitForElementVisible("[data-test=createCaseButton]", 20000)
            .verify.title("Complaint Manager")
            .assert.urlEquals(HOST)
            .end()
    }
};
