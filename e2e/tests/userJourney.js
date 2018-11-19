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
        .click("[data-test=phoneNumberInput]")
        .keys("\uE012") //left arrow key
        .keys("1234567890")
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
          "Civilian was successfully updated"
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
          "Civilian was successfully updated"
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

    "should navigate to Add Case Officer Page to add second officer": browser => {
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

    "should navigate to add officer form for unknown second officer": browser => {
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

    "should see Unknown Second Officer in Accused section when added": browser => {
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

    "should not see officer on case when removed": browser => {
      browser
        .click(
          '[data-test="unknownOfficerPanel"] [data-test="manageCaseOfficer"]'
        )
        .waitForElementVisible('[data-test="removeCaseOfficer"]', rerenderWait)
        .click('[data-test="removeCaseOfficer"]')
        .waitForElementVisible(
          '[data-test="removePersonDialogTitle"]',
          rerenderWait
        )
        .click('[data-test="removeButton"]')
        .waitForElementPresent(
          '[data-test="sharedSnackbarBannerText"]',
          roundTripWait
        )
        .assert.containsText(
          '[data-test="sharedSnackbarBannerText"]',
          "Officer was successfully removed"
        )
        .pause(1000)
        .expect.element('[data-test="unknownOfficerPanel"]').to.not.be.present;
    },

    "should open begin letter in progress dialog to begin letter": browser => {
      browser
        .waitForElementVisible(
          '[data-test="update-status-button"]',
          roundTripWait
        )
        .assert.containsText(
          '[data-test="update-status-button"]',
          "BEGIN LETTER"
        )
        .click('[data-test="update-status-button"]')
        .waitForElementVisible(
          '[data-test="updateStatusDialogTitle"]',
          roundTripWait
        )
        .waitForElementVisible(
          '[data-test="update-case-status-button"]',
          roundTripWait
        )
        .click('[data-test="update-case-status-button"]')
        .waitForElementPresent(
          '[data-test="letter-review-page-header"]',
          rerenderWait
        )
        .assert.containsText(
          '[data-test="letter-review-page-header"]',
          "Review Case Details"
        )
        .waitForElementPresent(
          '[data-test="sharedSnackbarBannerText"]',
          roundTripWait
        )
        // .pause(1000)
        .assert.containsText(
          '[data-test="sharedSnackbarBannerText"]',
          "Status was successfully updated"
        )
        .click('[data-test="closeSnackbar"]')
        .waitForElementNotPresent(
          '[data-test="sharedSnackbarBannerText"]',
          rerenderWait
        )
        .assert.urlContains("letter/review");
    },

    "should advance to officer complaint history": browser => {
      browser
        .click('[data-test="next-button"]')
        .waitForElementPresent(
          '[data-test="complaint-history-page-header"]',
          rerenderWait
        )
        .assert.containsText(
          '[data-test="complaint-history-page-header"]',
          "Officer Complaint History"
        )
        .assert.urlContains("letter/officer-history");
    },

    "should add number of allegations to officer": browser => {
      browser
        .setValue(
          '[data-test="letterOfficers[0]-numHistoricalHighAllegations"] input',
          ["2"]
        )
        .setValue(
          '[data-test="letterOfficers[0]-numHistoricalMedAllegations"] input',
          ["3"]
        )
        .setValue(
          '[data-test="letterOfficers[0]-numHistoricalLowAllegations"] input',
          ["5"]
        )
        .click('[data-test="next-button"]')
        .waitForElementPresent(
          '[data-test="iapro-corrections-page-header"]',
          rerenderWait
        )
        .assert.containsText(
          '[data-test="iapro-corrections-page-header"]',
          "IAPro Corrections"
        );
    },

    "should remove iapro correction": browser => {
      browser
        .setValue('[name="referralLetterIAProCorrections[0].details"]', [
          "IAPro Correction Details"
        ])
        .setValue('[name="referralLetterIAProCorrections[1].details"]', [
          "Details to delete"
        ])
        .click(
          '[data-test="referralLetterIAProCorrections[1]-open-remove-dialog-button"]'
        )
        .waitForElementPresent(
          '[data-test="remove-iapro-correction-button"]',
          rerenderWait
        )
        .click('[data-test="remove-iapro-correction-button"]')
        .waitForElementNotPresent(
          '[data-test="remove-iapro-correction-button"]',
          rerenderWait
        );
      browser.expect
        .element('[name="referralLetterIAProCorrections[0].details"]')
        .text.to.equal("IAPro Correction Details");
      browser.expect
        .element('[name="referralLetterIAProCorrections[1].details"]')
        .text.to.equal("");
    },

    "should add iapro correction": browser => {
      browser
        .click("[data-test='addIAProCorrectionButton']")
        .waitForElementPresent(
          '[name="referralLetterIAProCorrections[2].details"]',
          rerenderWait
        );
    },

    "should advance to recommended actions and check retaliation concerns and recommended action": browser => {
      browser
        .pause(2000)
        .click("[data-test='next-button']")

        .waitForElementPresent(
          '[data-test="recommended-actions-page-header"]',
          rerenderWait
        )
        .assert.containsText(
          '[data-test="recommended-actions-page-header"]',
          "Recommended Actions"
        )
        .waitForElementPresent(
          '[data-test="sharedSnackbarBannerText"]',
          roundTripWait
        )
        .assert.containsText(
          '[data-test="sharedSnackbarBannerText"]',
          "IAPro corrections were successfully updated"
        )
        .click('[data-test="closeSnackbar"]')
        .waitForElementNotPresent(
          '[data-test="sharedSnackbarBannerText"]',
          rerenderWait
        )
        .click('[data-test="include-retaliation-concerns-field"] input')
        .click('[data-test="letterOfficers[0]-1"] input');
    },

    "should advance to letter preview and check letter contents": browser => {
      browser
        .click("[data-test='next-button']")
        .waitForElementPresent(
          '[data-test="preview-page-header"]',
          rerenderWait
        )
        .assert.containsText('[data-test="preview-page-header"]', "Preview")
        .waitForElementPresent(
          '[data-test="sharedSnackbarBannerText"]',
          roundTripWait
        )
        .assert.containsText(
          '[data-test="sharedSnackbarBannerText"]',
          "Recommended actions were successfully updated"
        )
        .assert.containsText(".letter-preview", "Name: Night Watch")
        .assert.containsText(".letter-preview", "Name: Ansel W Rice")
        .assert.containsText(
          ".letter-preview",
          "Location: Bourbon St & Canal St, New Orleans, LA 70112"
        )
        .assert.containsText(
          ".letter-preview",
          "10 total complaints including 2 HIGH RISK allegations, 3 MEDIUM RISK allegations, 5 LOW RISK allegations"
        )
        .assert.containsText(".letter-preview", "IAPro Correction Details")
        .assert.containsText(
          ".letter-preview",
          "Retaliation Concerns and Request for Notice to Officer(s)"
        )
        .assert.containsText(
          ".letter-preview",
          "Be temporarily or permanently reassigned from his/her current assignment"
        );
    },

    "should edit letter": browser => {
      browser
        .click('[data-test="closeSnackbar"]')
        .waitForElementNotPresent(
          '[data-test="sharedSnackbarBannerText"]',
          rerenderWait
        )
        .click('[data-test="edit-confirmation-dialog-button"]')
        .waitForElementPresent('[data-test="edit-letter-button"]', rerenderWait)
        .click('[data-test="edit-letter-button"]')
        .waitForElementPresent(
          '[data-test="sharedSnackbarBannerText"]',
          rerenderWait
        )
        .assert.containsText(
          '[data-test="sharedSnackbarBannerText"]',
          "Letter was successfully updated"
        )
        .waitForElementVisible('[data-test="closeSnackbar"]', rerenderWait)
        .click('[data-test="closeSnackbar"]')
        .waitForElementVisible(
          '[data-test="edit-letter-page-header"]',
          rerenderWait
        )
        .click(".ql-editor")
        .keys("Susie and Sarah and Phoebe are the G.O.A.T.s")
        .click("[data-test='saveButton'")
        .waitForElementPresent(
          '[data-test="preview-page-header"]',
          rerenderWait
        )
        .assert.containsText('[data-test="preview-page-header"]', "Preview")
        .waitForElementPresent(
          '[data-test="sharedSnackbarBannerText"]',
          rerenderWait
        )
        .assert.containsText(
          '[data-test="sharedSnackbarBannerText"]',
          "Letter was successfully updated"
        )

        .assert.containsText(
          ".letter-preview",
          "Susie and Sarah and Phoebe are the G.O.A.T.s"
        )
        .waitForElementVisible('[data-test="closeSnackbar"]', rerenderWait)
        .click('[data-test="closeSnackbar"]')
        .waitForElementNotPresent(
          '[data-test="sharedSnackbarBannerText"]',
          rerenderWait
        );
    },

    "should submit for review": browser => {
      browser
        .click("[data-test='submit-for-review-button']")
        .waitForElementVisible(
          '[data-test="update-case-status-button"]',
          rerenderWait
        )
        .click('[data-test="update-case-status-button"]')
        .waitForElementVisible("[data-test='case-details-page']", rerenderWait);
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
