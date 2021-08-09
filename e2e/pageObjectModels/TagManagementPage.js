const e2e = require("./e2eUtilities.js");
const util = require("util");
const c2x = require("css2xpath");

const tagManagementPageCommands = {
  isOnPage: function () {
    return this.waitForElementVisible("@tagManagementTable", e2e.roundtripWait);
  },
  tagExists: function (name) {
    this.waitForElementVisible(
      `tr[data-testid='tagTableRow-${name}']`,
      e2e.rerenderWait
    );
  },
  editTag: function (name) {
    return this.waitForElementVisible(
      `tr[data-testid='tagTableRow-${name}']`,
      e2e.rerenderWait
    ).click(
      `tr[data-testid='tagTableRow-${name}'] button[data-testid='editTagButton']`
    );
  }
};

module.exports = {
  commands: [tagManagementPageCommands],
  elements: {
    tagManagementTable: {
      selector: '[data-testid="tag-management-table"]'
    },
    tagTableRow: {
      selector: "tr.MuiTableRow-root"
    },
    editButton: {
      selector: '[data-testid="editTagButton"]'
    }
  }
};
