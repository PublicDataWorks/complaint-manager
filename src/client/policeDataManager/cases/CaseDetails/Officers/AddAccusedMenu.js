import LinkButton from "../../../shared/components/LinkButton";
import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { initialize } from "redux-form";
import {
  ACCUSED,
  CIVILIAN_FORM_NAME,
  OFFICER_DETAILS_FORM_NAME,
  OFFICER_TITLE
} from "../../../../../sharedUtilities/constants";
import { openCivilianDialog } from "../../../actionCreators/casesActionCreators";
import createCivilian from "../../thunks/createCivilian";
import { push } from "connected-react-router";
import { addCaseEmployeeType } from "../../../actionCreators/officersActionCreators";

const {
  CIVILIAN_WITHIN_PD_TITLE,
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const AddAccusedMenu = props => {
  return (
    <div>
      <LinkButton
        style={{
          marginLeft: "8px",
          marginTop: "8px",
          marginBottom: "8px"
        }}
        onClick={props.handleMenuOpen}
        data-testid="addAccusedMenu"
      >
        + Add Accused
      </LinkButton>
      <Menu
        data-testid="addAccusedMenu"
        open={props.menuOpen}
        onClose={props.handleMenuClose}
        anchorEl={props.anchorEl}
        getContentAnchorEl={null}
      >
        <MenuItem
          data-testid="addAccusedOfficer"
          onClick={() => {
            props.handleMenuClose();
            props.dispatch(
              initialize(OFFICER_DETAILS_FORM_NAME, {
                roleOnCase: ACCUSED
              })
            );
            props.dispatch(
              addCaseEmployeeType(PERSON_TYPE.KNOWN_OFFICER.employeeDescription)
            );
            props.dispatch(push(`/cases/${props.caseId}/officers/search`));
          }}
        >
          Accused {OFFICER_TITLE}
        </MenuItem>
        <MenuItem
          data-testid="addAccusedCivilianWithinPD"
          onClick={() => {
            props.handleMenuClose();
            props.dispatch(
              initialize(OFFICER_DETAILS_FORM_NAME, {
                roleOnCase: ACCUSED
              })
            );
            props.dispatch(
              addCaseEmployeeType(
                PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
              )
            );
            props.dispatch(push(`/cases/${props.caseId}/officers/search`));
          }}
        >
          Accused {CIVILIAN_WITHIN_PD_TITLE}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AddAccusedMenu;
