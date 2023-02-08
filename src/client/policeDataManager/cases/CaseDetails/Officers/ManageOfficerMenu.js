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
  CONFIGS,
  OFFICER_DETAILS_FORM_NAME,
  OFFICER_TITLE
} from "../../../../../sharedUtilities/constants";
import useMenuControl from "../../../../common/hooks/useMenuControl";

const ManageOfficerMenu = props => {
  const { menuOpen, anchorEl, handleMenuOpen, handleMenuClose } =
    useMenuControl();

  const { caseOfficer, pd } = props;

  const isCivilianWithinPd = caseOfficer.caseEmployeeType.includes("Civilian");

  const caseEmployeeTitle = isCivilianWithinPd
    ? `Civilian (${pd})`
    : OFFICER_TITLE;

  return (
    <div>
      <LinkButton data-testid="manageCaseOfficer" onClick={handleMenuOpen}>
        Manage
      </LinkButton>
      <Menu open={menuOpen} anchorEl={anchorEl} onClose={handleMenuClose}>
        <MenuItem
          data-testid="addAllegation"
          onClick={() => {
            props.dispatch(
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
            handleMenuClose(event);
            if (caseOfficer.officerId) {
              props.dispatch(selectCaseOfficer(caseOfficer));
              props.dispatch(addCaseEmployeeType(caseOfficer.caseEmployeeType));
            } else {
              props.dispatch(selectUnknownOfficer());
            }
            props.dispatch(
              initialize(OFFICER_DETAILS_FORM_NAME, {
                notes: caseOfficer.notes,
                roleOnCase: caseOfficer.roleOnCase,
                officerId: caseOfficer.officerId,
                phoneNumber: caseOfficer.phoneNumber,
                email: caseOfficer.email
              })
            );
            props.dispatch(
              push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
            );
          }}
        >
          {`Edit ${caseEmployeeTitle}`}
        </MenuItem>
        <MenuItem
          data-testid="removeCaseOfficer"
          onClick={event => {
            handleMenuClose(event);
            return props.dispatch(
              openRemovePersonDialog(caseOfficer, "cases-officers", pd)
            );
          }}
        >
          {`Remove ${caseEmployeeTitle}`}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default connect(state => ({ pd: state.configs[CONFIGS.PD] }))(
  ManageOfficerMenu
);
