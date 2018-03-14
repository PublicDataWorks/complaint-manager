const path = require('path')

const TEST_USER = process.env.TEST_USER
const TEST_PASS = process.env.TEST_PASS
const HOST = process.env.HOST

if (!TEST_PASS) {
    console.log("Set the password in the ENV VAR 'TEST_PASS' for login")
}
if (!TEST_USER) {
    console.log("Set the username in the ENV VAR 'TEST_USER' for login")
}
if (!HOST) {
    console.log("Set the host in the ENV VAR 'HOST' for login")
}

if (TEST_PASS && TEST_USER && HOST) {
    module.exports = {
        "should see sign-in title": (browser) => {
            browser
                .url(HOST)
                .waitForElementVisible("body", 3000)
                .verify.title("Sign In with Auth0")
        },

        "should authenticate and create case with attachment": (browser) => {
            const roundTripWait = 20000;
            const rerenderWait = 1000;

            const imagesDir = 'images/'

            const invalidImageFileName = 'invalid_file_type.png'
            const validImageFileName = 'dog_nose.jpg'
            browser
                .waitForElementVisible("[name=email]", rerenderWait)
                .setValue("[name=email]", TEST_USER)
                .setValue("[name=password]", TEST_PASS)
                .click('button[type=submit]')
                .waitForElementVisible("[data-test=createCaseButton]", roundTripWait)
                .verify.title("Complaint Manager")
                .assert.urlEquals(HOST)

                .click("button[data-test=createCaseButton]")
                .waitForElementVisible("[data-test=firstNameInput]", rerenderWait)
                .setValue("[data-test=firstNameInput]", 'Night')
                .setValue("[data-test=lastNameInput]", 'Watch')
                .setValue("[data-test=phoneNumberInput]", '1234567890')
                .click("button[data-test=createAndView]")
                .waitForElementVisible("[data-test=case-number]", roundTripWait)
                .assert.urlContains('cases')

                .setValue('input[type="file"]', path.resolve(__dirname, imagesDir, invalidImageFileName))
                .moveToElement("div.dz-preview", 60, 60)
                .waitForElementVisible("[data-test=invalidFileTypeErrorMessage]", rerenderWait)
                .assert.containsText("[data-test=invalidFileTypeErrorMessage]", "File type not supported")

                .setValue('input[type="file"]', path.resolve(__dirname, imagesDir, validImageFileName))
                .waitForElementVisible("[data-test=attachmentRow]", roundTripWait)
                .assert.containsText("[data-test=attachmentRow]", validImageFileName)
                .end()
        },

    };
}

