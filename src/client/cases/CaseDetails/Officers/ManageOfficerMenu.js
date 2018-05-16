import React from "react";
import { push } from "react-router-redux";
import { selectCaseOfficer } from "../../../actionCreators/officersActionCreators";
import { Button, Menu, MenuItem } from "material-ui";
import { connect } from "react-redux";
import { SecondaryButton } from "../../../sharedComponents/StyledButtons";

class ManageOfficerMenu extends React.Component {
  state = { menuOpen: false, anchorEl: null };

  handleMenuOpen = event => {
    event.stopPropagation();
    this.setState({ menuOpen: true, anchorEl: event.target });
  };

  render() {
    const { caseOfficer } = this.props;

    return (
      <div style={{ marginLeft: "88px" }}>
        <SecondaryButton
          style={{ visibility: "hidden" }}
          data-test="manageOfficer"
          onClick={this.handleMenuOpen}
        >
          Manage
        </SecondaryButton>
        <Menu open={this.state.menuOpen} anchorEl={this.state.anchorEl}>
          <MenuItem
            data-test="editOfficer"
            onClick={event => {
              this.props.dispatch(selectCaseOfficer(caseOfficer));
              this.props.dispatch(
                push(
                  `/api/cases/${caseOfficer.caseId}/cases-officers/${
                    caseOfficer.id
                  }`
                )
              );
            }}
          >
            Edit Case
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default connect()(ManageOfficerMenu);
