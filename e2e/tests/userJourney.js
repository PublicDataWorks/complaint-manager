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
  const roundTripWait = 25000;
  const rerenderWait = 2000;

  module.exports = {
    "should see sign-in title": browser => {
      browser
        .url(HOST)
        .resizeWindow(1366, 768)
        .waitForElementVisible("body", rerenderWait)
        .assert.title("Sign In with Auth0");
    },

    "should authenticate": browser => {
      browser
        .waitForElementVisible("[name=email]", rerenderWait)
        .setValue("[name=email]", TEST_USER)
        .setValue("[name=password]", TEST_PASS)
        .click("button[type=submit]")
        .waitForElementVisible("[data-test=createCaseButton]", roundTripWait)
        .assert.title("Complaint Manager")
        .assert.urlEquals(HOST);
    },

    "should create case": browser => {
      browser
        .click("button[data-test=createCaseButton]")
        .waitForElementVisible("[data-test=firstNameInput]", rerenderWait)
        .setValue("[data-test=firstNameInput]", "Night")
        .setValue("[data-test=lastNameInput]", "Watch")
        .setValue("[data-test=phoneNumberInput]", "1234567890")
        .click("button[data-test=createAndView]")
        .waitForElementVisible("[data-test=case-number]", roundTripWait)
        .assert.urlContains("cases");
    },

    "should add and remove an attachment": browser => {
      const imagesDir = "images/";
      const fileName = "dog_nose.jpg";

      browser
        .setValue(
          'input[type="file"]',
          path.resolve(__dirname, imagesDir, fileName)
        )
        .waitForElementVisible(
          "[data-test='attachmentDescriptionInput']",
          roundTripWait
        )
        .setValue('[data-test="attachmentDescriptionInput"]', "a description")
        .waitForElementVisible(
          "[data-test=attachmentUploadButton]",
          rerenderWait
        )
        .click("[data-test=attachmentUploadButton]")
        .pause(2000)

        .waitForElementVisible("[data-test=attachmentRow]", roundTripWait)
        .assert.containsText("[data-test=attachmentRow]", fileName)
        .waitForElementVisible(
          "[data-test=removeAttachmentButton]",
          roundTripWait
        )
        .click("[data-test=removeAttachmentButton]")
        .pause(2000)
        .click("[data-test=confirmRemoveAttachmentButton]")
        .pause(2000)

        .waitForElementVisible("[data-test=noAttachmentsText]", roundTripWait)
        .assert.containsText(
          "[data-test=noAttachmentsText]",
          "No files are attached"
        )
        .pause(2000);
    },

    "should open edit civilian form": browser => {
      browser
        .click("[data-test=editComplainantLink]")
        .waitForElementVisible("[data-test=editDialogTitle]", rerenderWait);
    },

    "should set gender identity ": browser => {
      browser
        .click('[data-test="genderDropdown"] > div > div > div')
        .waitForElementVisible('[id="menu-genderIdentity"]', rerenderWait)
        .click("li[data-value=Female]")
        .waitForElementNotPresent('[id="menu-genderIdentity"]', rerenderWait);
    },

    "should set race or ethnicity": browser => {
      browser
        .click('[data-test="raceDropdown"] > div > div > div')
        .pause(1000) //TODO it takes longer to render the long list of races/ethnicities.  Need to wait so that click isn't dragged in animation
        .waitForElementVisible('[id="menu-raceEthnicity"]', rerenderWait)
        .click("li[data-value=Cuban]")
        .waitForElementNotPresent('[id="menu-raceEthnicity"]', rerenderWait);
    },

    "should display suggestions when text is entered": browser => {
      browser
        .setValue('[data-test="addressSuggestionField"] > input', ["6500"])
        .waitForElementPresent(
          '[data-test="suggestion-container"] > ul',
          rerenderWait
        )
        .pause(1000); //Need to wait for suggestions to finish updating (Network call)
    },

    "should not select suggestion when navigating through them": browser => {
      browser
        .setValue('[data-test="addressSuggestionField"] > input', [
          browser.Keys.ARROW_DOWN
        ])
        .pause(1000)
        .getValue('[data-test="addressSuggestionField"] > input', result => {
          browser.assert.ok(result.value.length > 4);
          this.address = result.value;
        });

      browser.expect
        .element('[data-test="streetAddressInput"]')
        .value.to.equal("");
      browser.expect.element('[data-test="cityInput"]').value.to.equal("");
      browser.expect.element('[data-test="stateInput"]').value.to.equal("");
      browser.expect.element('[data-test="zipCodeInput"]').value.to.equal("");
      browser.expect.element('[data-test="countryInput"]').value.to.equal("");
    },
    "should select suggestion on enter/click": browser => {
      browser
        .setValue('[data-test="addressSuggestionField"] > input', [
          browser.Keys.ENTER
        ])
        .pause(2000);

      browser.expect
        .element('[data-test="streetAddressInput"]')
        .value.to.not.equal("");
      browser.expect.element('[data-test="cityInput"]').value.to.not.equal("");
      browser.expect.element('[data-test="stateInput"]').value.to.not.equal("");
      browser.expect
        .element('[data-test="zipCodeInput"]')
        .value.to.not.equal("");
      browser.expect
        .element('[data-test="countryInput"]')
        .value.to.not.equal("");
    },

    "should submit address": browser => {
      browser
        .click('button[data-test="submitEditCivilian"]')
        .waitForElementPresent(
          '[data-test="sharedSnackbarBannerText"]',
          roundTripWait
        )
        .assert.containsText(
          '[data-test="sharedSnackbarBannerText"]',
          "Complainant & Witnesses successfully updated"
        )
        .pause(1000);
    },

    "should display the address in the Complainant & Witnesses section of the Case Detail": browser => {
      browser.expect
        .element('p[data-test="civilianAddress"]')
        .text.to.not.equal("No address specified");
    },

    "should submit blank address when cleared and submitted": browser => {
      browser
        .waitForElementPresent("[data-test=editComplainantLink]", rerenderWait)
        .click("[data-test=editComplainantLink]")
        .waitForElementVisible("[data-test=editDialogTitle]", rerenderWait)
        .clearValue('[data-test="addressSuggestionField"] > input')
        .pause(1000)
        .setValue('[data-test="addressSuggestionField"] > input', [
          " ",
          browser.Keys.BACK_SPACE
        ])
        .pause(1000);

      browser.expect
        .element('[data-test="addressSuggestionField"] > input')
        .text.to.equal("");
      browser.expect
        .element('[data-test="streetAddressInput"]')
        .value.to.equal("");
      browser.expect.element('[data-test="cityInput"]').value.to.equal("");
      browser.expect.element('[data-test="stateInput"]').value.to.equal("");
      browser.expect.element('[data-test="zipCodeInput"]').value.to.equal("");
      browser.expect.element('[data-test="countryInput"]').value.to.equal("");

      browser
        .click('button[data-test="submitEditCivilian"]')
        .waitForElementPresent(
          '[data-test="sharedSnackbarBannerText"]',
          roundTripWait
        )
        .assert.containsText(
          '[data-test="sharedSnackbarBannerText"]',
          "Complainant & Witnesses successfully updated"
        )
        .pause(1000);
    },

    "should not show address in Complainant & Witnesses section of Case Detail": browser => {
      browser
        .waitForElementPresent('p[data-test="civilianAddress"]', roundTripWait)
        .pause(1000);

      const expansionPanel = '[data-test="complainantWitnessesPanel"] > div';
      browser.getAttribute(expansionPanel, "aria-expanded", expanded => {
        if (!expanded) {
          browser.click(expansionPanel).pause(1000);
        }
      });

      browser.getText('p[data-test="civilianAddress"]', result => {
        browser.assert.containsText(
          'p[data-test="civilianAddress"]',
          result.value
        );
      });
    },

    "should open incident details": browser => {
      browser
        .waitForElementPresent(
          '[data-test="editIncidentDetailsButton"]',
          rerenderWait
        )
        .click('[data-test="editIncidentDetailsButton"]');
    },

    "should enter and fill intersection address into incident location": browser => {
      browser
        .setValue('[data-test="addressSuggestionField"] > input', [
          "canal st & bourbon st"
        ])
        .waitForElementPresent(
          '[data-test="saveIncidentDetailsButton"]',
          rerenderWait
        )
        .click('[data-test="saveIncidentDetailsButton"]')
        .waitForElementPresent(
          '[data-test="fillAddressToConfirm"]',
          rerenderWait
        )
        .click('[data-test="fillAddressToConfirm"]')
        .waitForElementPresent(
          '[data-test="saveIncidentDetailsButton"]',
          rerenderWait
        )
        .click('[data-test="saveIncidentDetailsButton"]');
    },

    "should display the incident location in the Incident Details section of the Case Detail": browser => {
      browser.pause(1000);
      browser.expect
        .element('[data-test="incidentLocation"]')
        .text.to.not.equal("No address specified");
    },

    "should navigate to Add Case Officer Page": browser => {
      browser
        .waitForElementVisible('[data-test="closeSnackbar"]', roundTripWait)
        .click('[data-test="closeSnackbar"]')
        .waitForElementVisible(
          '[data-test="addAccusedOfficerButton"]',
          rerenderWait
        )
        .pause(1000)
        .click('[data-test="addAccusedOfficerButton"]')
        .waitForElementVisible(
          '[data-test="selectUnknownOfficerLink"]',
          rerenderWait
        );
    },

    "should navigate to add officer form for unknown officer": browser => {
      browser
        .click('[data-test="selectUnknownOfficerLink"]')
        .waitForElementVisible(
          '[data-test="roleOnCaseDropdown"] > div > div > div',
          rerenderWait
        )
        .click('[data-test="roleOnCaseDropdown"] > div > div > div')
        .waitForElementVisible('[id="menu-roleOnCase"]', rerenderWait)
        .click("li[data-value=Accused]")
        .waitForElementNotPresent('[id="menu-roleOnCase"]', rerenderWait)
        .waitForElementVisible(
          '[data-test="officerSubmitButton"]',
          rerenderWait
        );
    },

    "should see Unknown Officer in Accused section when added": browser => {
      browser
        .click('[data-test="officerSubmitButton"]')
        .waitForElementVisible(
          '[data-test="unknownOfficerPanel"]',
          roundTripWait
        )
        .assert.containsText(
          '[data-test="unknownOfficerPanel"]',
          "Unknown Officer"
        );
    },

    "should see Edit Officer page when Edit Officer clicked": browser => {
      browser
        .click('[data-test="manageCaseOfficer"]')
        .waitForElementVisible('[data-test="editCaseOfficer"]', rerenderWait)
        .click('[data-test="editCaseOfficer"]')
        .waitForElementVisible('[data-test="changeOfficerLink"]', rerenderWait);
    },

    "should see Edit Officer search page when change officer clicked": browser => {
      browser
        .click('[data-test="changeOfficerLink"]')
        .waitForElementVisible(
          '[data-test="officerSearchSubmitButton"]',
          rerenderWait
        );
    },

    "should search for officer to replace unknown": browser => {
      browser
        .setValue('[data-test="lastNameField"]', "Ri")
        .click('[data-test="officerSearchSubmitButton"]')
        .waitForElementVisible(
          '[data-test="selectNewOfficerButton"]',
          roundTripWait
        );
    },

    "should return to Edit Officer when new officer selected": browser => {
      browser
        .click('[data-test="selectNewOfficerButton"]')
        .waitForElementVisible('[data-test="changeOfficerLink"]', rerenderWait);
    },

    "should see that officer is no longer unknown in accused officers": browser => {
      browser
        .click('[data-test="officerSubmitButton"]')
        .waitForElementVisible('[data-test="officerPanel"]', roundTripWait)
        .assert.containsText('[data-test="officerPanel"]', "Ri");
    },

    "should add an allegation to the officer": browser => {
      browser
        .click('[data-test="manageCaseOfficer"]')
        .waitForElementVisible('[data-test="addAllegation"]', rerenderWait)
        .click('[data-test="addAllegation"]')
        .waitForElementVisible('[data-test="ruleDropdown"]', rerenderWait)
        .click('[data-test="ruleDropdown"]')
        .waitForElementVisible('[role="listbox"]', 3000)
        .pause(1000)
        .click('[role="listbox"] > li:last-child')
        .waitForElementVisible(
          '[data-test="allegationSearchSubmitButton"]',
          1500
        )
        .pause(1000)
        .click('[data-test="allegationSearchSubmitButton"]')
        .waitForElementVisible('[data-test="selectAllegationButton"]', 5000)
        .click('[data-test="selectAllegationButton"]')
        .setValue(
          '[data-test="allegationDetailsInput"]',
          "Used department property."
        )
        .waitForElementVisible(
          '[data-test="allegationSeverityField"]',
          rerenderWait
        )
        .click('[data-test="allegationSeverityField"]')
        .waitForElementVisible('[role="listbox"]', 3000)
        .click('[role="listbox"] > li:last-child')
        .waitForElementVisible(
          '[data-test="addAllegationButton"]',
          rerenderWait
        )
        .pause(1000)
        .click('[data-test="addAllegationButton"]')
        .waitForElementVisible('[data-test="officerAllegation0"]', rerenderWait)
        .click('[data-test="back-to-case-link"]');
    },

    "should not see officer on case when removed": browser => {
      browser
        .click('[data-test="manageCaseOfficer"]')
        .waitForElementVisible('[data-test="removeCaseOfficer"]', rerenderWait)
        .click('[data-test="removeCaseOfficer"]')
        .waitForElementVisible(
          '[data-test="removePersonDialogTitle"]',
          rerenderWait
        )
        .click('[data-test="removeButton"]')
        .waitForElementVisible(
          '[data-test="noAccusedOfficersMessage"]',
          roundTripWait
        )
        .assert.containsText(
          '[data-test="noAccusedOfficersMessage"]',
          "No accused officers have been added"
        );
    },

    "should log out of the system": browser => {
      browser
        .click('[data-test="gearButton"]')
        .waitForElementVisible('[data-test="logOutButton"]', rerenderWait)
        .click('[data-test="logOutButton"]')
        .waitForElementVisible("body", rerenderWait)
        .assert.title("Sign In with Auth0");
    },

    "end user journey ;)": browser => {
      browser.end();
    }
  };
}
