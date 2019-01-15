import React from "react";
import { push } from "react-router-redux";
import { Menu, MenuItem } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import {
  selectCaseOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { openRemovePersonDialog } from "../../../actionCreators/casesActionCreators";

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
      <div style={{ marginLeft: "69.5px" }}>
        <LinkButton data-test="manageCaseOfficer" onClick={this.handleMenuOpen}>
          Manage
        </LinkButton>
        <Menu
          open={this.state.menuOpen}
          anchorEl={this.state.anchorEl}
          onClose={this.handleMenuClose}
        >
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
            Manage Allegations
          </MenuItem>
          <MenuItem
            data-test="editCaseOfficer"
            onClick={event => {
              this.handleMenuClose(event);
              if (caseOfficer.officerId) {
                this.props.dispatch(selectCaseOfficer(caseOfficer));
              } else {
                this.props.dispatch(selectUnknownOfficer());
              }
              this.props.dispatch(
                initialize("OfficerDetails", {
                  notes: caseOfficer.notes,
                  roleOnCase: caseOfficer.roleOnCase,
                  officerId: caseOfficer.officerId
                })
              );
              this.props.dispatch(
                push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
              );
            }}
          >
            Edit Officer
          </MenuItem>
          <MenuItem
            data-test="removeCaseOfficer"
            onClick={event => {
              this.handleMenuClose(event);
              return this.props.dispatch(
                openRemovePersonDialog(caseOfficer, "cases-officers")
              );
            }}
          >
            Remove Officer
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default connect()(ManageOfficerMenu);
