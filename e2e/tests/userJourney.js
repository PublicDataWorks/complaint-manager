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
    const roundTripWait = 20000;
    const rerenderWait = 1000;

    module.exports = {
        "should see sign-in title": (browser) => {
            browser
                .url(HOST)
                .waitForElementVisible("body", rerenderWait)
                .verify.title("Sign In with Auth0")
        },

        "should authenticate": (browser) => {
            browser
                .waitForElementVisible("[name=email]", rerenderWait)
                .setValue("[name=email]", TEST_USER)
                .setValue("[name=password]", TEST_PASS)
                .click('button[type=submit]')
                .waitForElementVisible("[data-test=createCaseButton]", roundTripWait)
                .verify.title("Complaint Manager")
                .assert.urlEquals(HOST)
        },

        "should create case": (browser) => {
            browser
                .click("button[data-test=createCaseButton]")
                .waitForElementVisible("[data-test=firstNameInput]", rerenderWait)
                .setValue("[data-test=firstNameInput]", 'Night')
                .setValue("[data-test=lastNameInput]", 'Watch')
                .setValue("[data-test=phoneNumberInput]", '1234567890')
                .click("button[data-test=createAndView]")
                .waitForElementVisible("[data-test=case-number]", roundTripWait)
                .assert.urlContains('cases')
        },

        "should add and remove an attachment": (browser) => {
            const imagesDir = 'images/'
            const fileName = 'dog_nose.jpg'

            browser
                .setValue('input[type="file"]', path.resolve(__dirname, imagesDir, fileName))
                .waitForElementVisible("[data-test='attachmentDescriptionInput']", roundTripWait)
                .setValue('[data-test="attachmentDescriptionInput"]', "a description")
                .waitForElementVisible('[data-test=attachmentUploadButton]', rerenderWait)
                .click('[data-test=attachmentUploadButton]')
                .pause(2000)

                .waitForElementVisible("[data-test=attachmentRow]", roundTripWait)
                .assert.containsText("[data-test=attachmentRow]", fileName)
                .waitForElementVisible("[data-test=removeAttachmentButton]", roundTripWait)
                .click('[data-test=removeAttachmentButton]')
                .pause(2000)
                .click('[data-test=confirmRemoveAttachmentButton]')
                .pause(2000)

                .waitForElementVisible("[data-test=noAttachmentsText]", roundTripWait)
                .assert.containsText("[data-test=noAttachmentsText]", 'No files are attached')
                .pause(2000)
        },

        "should open edit civilian form": (browser) => {
            browser
                .click("[data-test=editComplainantLink]")
                .waitForElementVisible("[data-test=editDialogTitle]", rerenderWait)

        },

        "should set gender identity ": (browser) => {
            browser
                .click('[data-test="genderDropdown"] > div > div > div')
                .waitForElementVisible('[id="menu-genderIdentity"]', rerenderWait)
                .click('li[value=Female]')
                .waitForElementNotPresent('[id="menu-genderIdentity"]', rerenderWait)
        },

        "should set race or ethnicity": (browser) => {
            browser
                .click('[data-test="raceDropdown"] > div > div > div')
                .pause(500) //TODO it takes longer to render the long list of races/ethnicities.  Need to wait so that click isn't dragged in animation
                .waitForElementVisible('[id="menu-raceEthnicity"]', rerenderWait)
                .click('li[value=Cuban]')
                .waitForElementNotPresent('[id="menu-raceEthnicity"]', rerenderWait)
        },

        "should display suggestions when text is entered": (browser) => {
            browser
                .setValue('[data-test="addressSuggestionField"] > input', ['200'])
                .waitForElementPresent('[data-test="suggestion-container"] > ul', rerenderWait)
                .pause(1000)  //Need to wait for suggestions to finish updating (Network call)

        },

        "should not select suggestion when navigating through them": (browser) => {
            browser
                .setValue('[data-test="addressSuggestionField"] > input', [browser.Keys.ARROW_DOWN])
                .pause(1000)
                .getText('li[data-suggestion-index="0"]', (result) => {
                    browser.assert.valueContains('[data-test="addressSuggestionField"] > input', result.value)
                    this.address = result.value
                })

            browser.expect.element('[data-test="streetAddressInput"]').value.to.equal('')
            browser.expect.element('[data-test="cityInput"]').value.to.equal('')
            browser.expect.element('[data-test="stateInput"]').value.to.equal('')
            browser.expect.element('[data-test="zipCodeInput"]').value.to.equal('')
            browser.expect.element('[data-test="countryInput"]').value.to.equal('')
        },
        "should select suggestion on enter/click": (browser) => {
            browser
                .setValue('[data-test="addressSuggestionField"] > input', [browser.Keys.ENTER])
                .pause(2000)

            browser.expect.element('[data-test="streetAddressInput"]').value.to.not.equal('')
            browser.expect.element('[data-test="cityInput"]').value.to.not.equal('')
            browser.expect.element('[data-test="stateInput"]').value.to.not.equal('')
            browser.expect.element('[data-test="zipCodeInput"]').value.to.not.equal('')
            browser.expect.element('[data-test="countryInput"]').value.to.not.equal('')
        },

        "should submit address": (browser) => {
            browser
                .click('button[data-test="submitEditCivilian"]')
                .waitForElementPresent('[data-test="sharedSnackbarBannerText"]', roundTripWait)
                .assert.containsText('[data-test="sharedSnackbarBannerText"]', 'Complainant & Witnesses successfully updated')
                .pause(500)
        },

        "should display the address in the Complainant & Witnesses section of the Case Detail": (browser) => {
            browser
                .expect.element('p[data-test="civilianAddress"]').text.to.not.equal('No address specified')
        },

        "should submit blank address when cleared and submitted": (browser) => {
            browser
                .waitForElementPresent("[data-test=editComplainantLink]", rerenderWait)
                .click("[data-test=editComplainantLink]")
                .waitForElementVisible("[data-test=editDialogTitle]", rerenderWait)
                .clearValue('[data-test="addressSuggestionField"] > input')
                .pause(500)
                .setValue('[data-test="addressSuggestionField"] > input', [' ', browser.Keys.BACK_SPACE])
                .pause(500)


            browser.expect.element('[data-test="addressSuggestionField"] > input').text.to.equal('');
            browser.expect.element('[data-test="streetAddressInput"]').value.to.equal('')
            browser.expect.element('[data-test="cityInput"]').value.to.equal('')
            browser.expect.element('[data-test="stateInput"]').value.to.equal('')
            browser.expect.element('[data-test="zipCodeInput"]').value.to.equal('')
            browser.expect.element('[data-test="countryInput"]').value.to.equal('')

            browser
                .click('button[data-test="submitEditCivilian"]')
                .waitForElementPresent('[data-test="sharedSnackbarBannerText"]', roundTripWait)
                .assert.containsText('[data-test="sharedSnackbarBannerText"]', 'Complainant & Witnesses successfully updated')
                .pause(500)
        },

        "should not show address in Complainant & Witnesses section of Case Detail": (browser) => {
            browser
                .waitForElementPresent('p[data-test="civilianAddress"]', roundTripWait)
                .pause(500)

            const expansionPanel = '[data-test="complainantWitnessesPanel"] > div';
            browser.getAttribute(expansionPanel, 'aria-expanded', (expanded) => {
                if (!expanded) {
                    browser
                        .click(expansionPanel)
                        .pause(1000)
                }
            })

            browser
                .getText('p[data-test="civilianAddress"]', (result) => {
                    browser.assert.containsText('p[data-test="civilianAddress"]', result.value)
                })
        },

        "should log out of the system": (browser) => {
            browser
                .click('[data-test="gearButton"]')
                .waitForElementVisible('[data-test="logOutButton"]',rerenderWait)
                .click('[data-test="logOutButton"]')
                .waitForElementVisible("body", rerenderWait)
                .verify.title("Sign In with Auth0")
        },

        "end user journey ;)": (browser) => {
            browser.end()
        }

    };
}

