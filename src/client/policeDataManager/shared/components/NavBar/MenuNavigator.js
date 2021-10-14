import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { MenuItem } from "@material-ui/core";
import { resetArchivedCasesPaging } from "../../../actionCreators/casesActionCreators";
import getArchivedCases from "../../../cases/thunks/getArchivedCases";
import {
  SORT_CASES_BY,
  DESCENDING
} from "../../../../../sharedUtilities/constants";

class MenuNavigator extends Component {
  generateMenuItem = menuItem => (
    <MenuItem
      key={menuItem.path}
      data-testid={menuItem.dataTestName}
      component={Link}
      onClick={() => {
        if (menuItem.dataTestName === "archivedCases") {
          this.props.resetArchivedCasesPaging();
          if (this.props.location.pathname === "/archived-cases") {
            this.props.getArchivedCases(
              SORT_CASES_BY.CASE_REFERENCE,
              DESCENDING,
              1
            );
          }
        }
        this.props.handleMenuClose();
      }}
      to={menuItem.path}
    >
      {menuItem.title}
    </MenuItem>
  );

  shouldGenerateMenuItem = toggleName => {
    if (toggleName) {
      const toggleState = this.props.featureToggles[toggleName];
      if (toggleState === false) {
        return false;
      }
    }
    return true;
  };

  render() {
    return (
      <div>
        {this.props.menuType.map(
          menuItem =>
            this.shouldGenerateMenuItem(menuItem.toggleName) &&
            this.generateMenuItem(menuItem)
        )}
      </div>
    );
  }
}

export default connect(undefined, {
  resetArchivedCasesPaging,
  getArchivedCases
})(MenuNavigator);
