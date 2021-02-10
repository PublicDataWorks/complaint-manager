import React from "react";
import { push } from "connected-react-router";
import { Menu, MenuItem } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import {
  addCaseEmployeeType,
  selectCaseOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { openRemovePersonDialog } from "../../../actionCreators/casesActionCreators";
import {
  CIVILIAN_WITHIN_PD_TITLE,
  EMPLOYEE_TYPE,
  OFFICER_DETAILS_FORM_NAME,
  OFFICER_TITLE
} from "../../../../../sharedUtilities/constants";

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

    const isCivilianWithinNopd =
      caseOfficer.caseEmployeeType === EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD;

    const caseEmployeeTitle = isCivilianWithinNopd
      ? CIVILIAN_WITHIN_PD_TITLE
      : OFFICER_TITLE;

    return (
      <div>
        <LinkButton
          data-testid="manageCaseOfficer"
          onClick={this.handleMenuOpen}
        >
          Manage
        </LinkButton>
        <Menu
          open={this.state.menuOpen}
          anchorEl={this.state.anchorEl}
          onClose={this.handleMenuClose}
        >
          <MenuItem
            data-testid="addAllegation"
            onClick={() => {
              this.props.dispatch(
                push(
                  `/cases/${caseOfficer.caseId}/cases-officers/${caseOfficer.id}/allegations/search`
                )
              );
            }}
          >
            Manage Allegations
          </MenuItem>
          <MenuItem
            data-testid="editCaseOfficer"
            onClick={event => {
              this.handleMenuClose(event);
              if (caseOfficer.officerId) {
                this.props.dispatch(selectCaseOfficer(caseOfficer));
                this.props.dispatch(
                  addCaseEmployeeType(caseOfficer.caseEmployeeType)
                );
              } else {
                this.props.dispatch(selectUnknownOfficer());
              }
              this.props.dispatch(
                initialize(OFFICER_DETAILS_FORM_NAME, {
                  notes: caseOfficer.notes,
                  roleOnCase: caseOfficer.roleOnCase,
                  officerId: caseOfficer.officerId,
                  phoneNumber: caseOfficer.phoneNumber,
                  email: caseOfficer.email
                })
              );
              this.props.dispatch(
                push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
              );
            }}
          >
            {`Edit ${caseEmployeeTitle}`}
          </MenuItem>
          <MenuItem
            data-testid="removeCaseOfficer"
            onClick={event => {
              this.handleMenuClose(event);
              return this.props.dispatch(
                openRemovePersonDialog(caseOfficer, "cases-officers")
              );
            }}
          >
            {`Remove ${caseEmployeeTitle}`}
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default connect()(ManageOfficerMenu);
