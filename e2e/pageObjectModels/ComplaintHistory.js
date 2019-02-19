const e2e = require("./e2eUtilities.js");

const complaintHistoryCommands = {
  isOnPage: function() {
    return this.waitForElementPresent(
      "@pageHeader",
      e2e.rerenderWait
    ).assert.containsText("@pageHeader", "Officer Complaint History");
  },
  clickNext: function() {
    return this.waitForElementPresent("@nextButton", e2e.rerenderWait).click(
      "@nextButton"
    );
  },
  setHighAllegations: function(numAllegations) {
    return this.setValue("@officerHighAllegations", [`${numAllegations}`]);
  },
  setMedAllegations: function(numAllegations) {
    return this.setValue("@officerMedAllegations", [`${numAllegations}`]);
  },
  setLowAllegations: function(numAllegations) {
    return this.setValue("@officerLowAllegations", [`${numAllegations}`]);
  },
  clickFourthOption: function() {
    return this.click("@officerHistoryOptionFour");
  }
};

module.exports = {
  commands: [complaintHistoryCommands],
  elements: {
    nextButton: {
      selector: "[data-test='next-button']"
    },
    pageHeader: {
      selector: '[data-test="complaint-history-page-header"]'
    },
    officerHighAllegations: {
      selector:
        '[data-test="letterOfficers[0]-numHistoricalHighAllegations"] input'
    },
    officerMedAllegations: {
      selector:
        '[data-test="letterOfficers[0]-numHistoricalMedAllegations"] input'
    },
    officerLowAllegations: {
      selector:
        '[data-test="letterOfficers[0]-numHistoricalLowAllegations"] input'
    },
    officerHistoryOptionFour: {
      selector: '[data-test="letterOfficers[0]-option-4"]'
    }
  }
};
