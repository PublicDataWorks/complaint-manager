import React, { Component } from "react";
import handleLogout from "../../../users/thunks/handleLogout";
import { Link } from "react-router-dom";
import { MenuItem } from "@material-ui/core";

class MenuNavigator extends Component {
  generateMenuItem = menuItem => (
    <MenuItem
      key={menuItem.path}
      data-testid={menuItem.dataTestName}
      component={Link}
      onClick={() => {
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

        <MenuItem data-testid="logOutButton" onClick={handleLogout}>
          Log Out
        </MenuItem>
      </div>
    );
  }
}

export default MenuNavigator;
