import {
  CIVILIAN_FORM_NAME,
  OFFICER_DETAILS_FORM_NAME,
  OFFICER_TITLE
} from "../../../../sharedUtilities/constants";
import {
  CIVILIAN_WITHIN_PD_TITLE,
  EMPLOYEE_TYPE
} from "../../../../instance-files/constants";
import { push } from "connected-react-router";
import createCivilian from "../thunks/createCivilian";
import { initialize } from "redux-form";
import { openCivilianDialog } from "../../actionCreators/casesActionCreators";
import { Menu, MenuItem } from "@material-ui/core";
import React from "react";
import LinkButton from "../../shared/components/LinkButton";
import { addCaseEmployeeType } from "../../actionCreators/officersActionCreators";

const ComplainantWitnessMenu = props => {
  return (
    <div>
      <LinkButton
        style={{
          marginLeft: "8px",
          marginTop: "8px",
          marginBottom: "8px"
        }}
        onClick={props.handleMenuOpen}
        data-testid="addComplainantWitness"
      >
        + Add {props.civilianType}
      </LinkButton>
      <Menu
        open={props.menuOpen}
        onClose={props.handleMenuClose}
        anchorEl={props.anchorEl}
        getContentAnchorEl={null}
      >
        <MenuItem
          data-testid="addCivilianComplainantWitness"
          onClick={() => {
            props.handleMenuClose();
            props.dispatch(
              initialize(CIVILIAN_FORM_NAME, {
                roleOnCase: props.civilianType,
                caseId: props.caseDetails.id
              })
            );
            props.dispatch(
              openCivilianDialog("Add Civilian", "Create", createCivilian)
            );
          }}
        >
          Civilian {props.civilianType}
        </MenuItem>
        <MenuItem
          data-testid="addOfficerComplainantWitness"
          onClick={() => {
            props.dispatch(
              initialize(OFFICER_DETAILS_FORM_NAME, {
                roleOnCase: props.civilianType
              })
            );
            props.dispatch(addCaseEmployeeType(EMPLOYEE_TYPE.OFFICER));
            props.dispatch(
              push(`/cases/${props.caseDetails.id}/officers/search`)
            );
          }}
        >
          {OFFICER_TITLE} {props.civilianType}
        </MenuItem>
        <MenuItem
          data-testid="addCivilianWithinPdComplainantWitness"
          onClick={() => {
            props.dispatch(
              initialize("OfficerDetails", {
                roleOnCase: props.civilianType
              })
            );
            props.dispatch(
              addCaseEmployeeType(EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD)
            );
            props.dispatch(
              push(`/cases/${props.caseDetails.id}/officers/search`)
            );
          }}
        >
          {CIVILIAN_WITHIN_PD_TITLE} {props.civilianType}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ComplainantWitnessMenu;
