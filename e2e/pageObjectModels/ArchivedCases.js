const e2e = require("./e2eUtilities.js");
const util = require("util");
const c2x = require("css2xpath");

const archivedCasesCommands = {
  isOnPage: function () {
    return this.waitForElementVisible(
      "@pageTitle",
      e2e.roundtripWait
    ).assert.containsText("@pageTitle", "View Archived Cases");
  },
  openArchivedCase: function () {
    const customSelector = util.format(
      this.elements.caseReference.selector,
      this.api.globals.current_case
    );
    this.api
      .useXpath()
      .waitForElementVisible(c2x(customSelector), e2e.roundtripWait)
      .click(c2x(customSelector), e2e.logOnClick)
      .useCss();
  }
};

module.exports = {
  commands: [archivedCasesCommands],
  elements: {
    pageTitle: { selector: "[data-testid='pageTitle']" },
    caseReference: {
      selector: "[data-testid='caseReference']:contains('%s')"
    },
  }
};
