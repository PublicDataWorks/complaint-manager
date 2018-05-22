import React from "react";
import { push } from "react-router-redux";
import { Menu, MenuItem } from "material-ui";
import {
  selectOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import { connect } from "react-redux";
import { SecondaryButton } from "../../../sharedComponents/StyledButtons";
import { initialize } from "redux-form";

class ManageOfficerMenu extends React.Component {
  state = { menuOpen: false, anchorEl: null };

  handleMenuOpen = event => {
    event.stopPropagation();
    this.setState({ menuOpen: true, anchorEl: event.target });
  };

  handleMenuClose = event => {
    event.stopPropagation();
    this.setState({ menuOpen: false, anchorEl: null });
  };

  render() {
    const { caseOfficer } = this.props;

    return (
      <div style={{ marginLeft: "88px" }}>
        <SecondaryButton
          data-test="manageCaseOfficer"
          onClick={this.handleMenuOpen}
        >
          Manage
        </SecondaryButton>
        <Menu
          open={this.state.menuOpen}
          anchorEl={this.state.anchorEl}
          onClose={this.handleMenuClose}
        >
          <MenuItem
            data-test="editCaseOfficer"
            onClick={() => {
              if (caseOfficer.officerId) {
                this.props.dispatch(selectOfficer(caseOfficer.officer));
              } else {
                this.props.dispatch(selectUnknownOfficer());
              }
              this.props.dispatch(initialize("OfficerDetails", caseOfficer));
              this.props.dispatch(
                push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
              );
            }}
          >
            Edit Officer
          </MenuItem>
          <MenuItem
            data-test="addAllegation"
            onClick={() => {
              this.props.dispatch(
                push(
                  `/cases/${caseOfficer.caseId}/cases-officers/${
                    caseOfficer.id
                  }/allegations/search`
                )
              );
            }}
          >
            Add Allegation
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default connect()(ManageOfficerMenu);
