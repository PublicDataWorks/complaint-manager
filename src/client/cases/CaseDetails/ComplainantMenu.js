import {
  CIVILIAN_FORM_NAME,
  COMPLAINANT
} from "../../../sharedUtilities/constants";
import { push } from "react-router-redux";
import createCivilian from "../thunks/createCivilian";
import { initialize } from "redux-form";
import { openCivilianDialog } from "../../actionCreators/casesActionCreators";
import { Menu, MenuItem } from "@material-ui/core";
import React from "react";

const ComplainantMenu = props => {
  return (
    <Menu
      open={props.complainantMenuOpen}
      onClose={props.handleComplainantMenuClose}
      anchorEl={props.anchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center"
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
    >
      <MenuItem
        data-test="addCivilianComplainant"
        onClick={() => {
          props.handleComplainantMenuClose();
          props.dispatch(
            initialize(CIVILIAN_FORM_NAME, {
              roleOnCase: COMPLAINANT,
              caseId: props.caseDetail.id
            })
          );
          props.dispatch(
            openCivilianDialog("Add Civilian", "Create", createCivilian)
          );
        }}
      >
        Civilian Complainant
      </MenuItem>
      <MenuItem
        data-test="addOfficerComplainant"
        onClick={() => {
          props.dispatch(
            initialize("OfficerDetails", {
              roleOnCase: COMPLAINANT
            })
          );
          props.dispatch(push(`/cases/${props.caseDetail.id}/officers/search`));
        }}
      >
        Officer Complainant
      </MenuItem>
    </Menu>
  );
};

export default ComplainantMenu;
