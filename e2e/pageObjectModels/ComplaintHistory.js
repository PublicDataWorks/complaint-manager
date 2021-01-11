const e2e = require("./e2eUtilities.js");

const complaintHistoryCommands = {
  isOnPage: function () {
    return this.waitForElementPresent(
      "@pageHeader",
      e2e.rerenderWait
    ).assert.containsText("@pageHeader", "Officer Complaint History");
  },
  clickNext: function () {
    return this.pause(e2e.pause)
      .waitForElementPresent("@nextButton", e2e.rerenderWait)
      .click("@nextButton");
  },
  setHighAllegations: function (numAllegations) {
    return this.setValue("@officerHighAllegations", [`${numAllegations}`]);
  },
  setMedAllegations: function (numAllegations) {
    return this.setValue("@officerMedAllegations", [`${numAllegations}`]);
  },
  setLowAllegations: function (numAllegations) {
    return this.setValue("@officerLowAllegations", [`${numAllegations}`]);
  },
  countAllegations: function (totalAllegations) {
    return this.waitForElementPresent(
      "@totalAllegations",
      e2e.rerenderWait
    ).assert.containsText(
      "@totalAllegations",
      `${totalAllegations}`
    );
  },
  clickFourthOption: function () {
    return this.click("@officerHistoryOptionFour");
  }
};

module.exports = {
  commands: [complaintHistoryCommands],
  elements: {
    nextButton: {
      selector: "[data-testid='next-button']"
    },
    pageHeader: {
      selector: '[data-testid="complaint-history-page-header"]'
    },
    officerHighAllegations: {
      selector:
        '[data-testid="letterOfficers[0]-numHistoricalHighAllegations"] input'
    },
    officerMedAllegations: {
      selector:
        '[data-testid="letterOfficers[0]-numHistoricalMedAllegations"] input'
    },
    officerLowAllegations: {
      selector:
        '[data-testid="letterOfficers[0]-numHistoricalLowAllegations"] input'
    },
    totalAllegations: {
      selector: '[data-testid="total-allegations-count"]'
    },
    officerHistoryOptionFour: {
      selector: '[data-testid="letterOfficers[0]-option-4"]'
    }
  }
};
