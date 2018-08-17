import {
  CIVILIAN_FORM_NAME,
  WITNESS
} from "../../../sharedUtilities/constants";
import { push } from "react-router-redux";
import createCivilian from "../thunks/createCivilian";
import { initialize } from "redux-form";
import { openCivilianDialog } from "../../actionCreators/casesActionCreators";
import { Menu, MenuItem } from "@material-ui/core";
import React from "react";

const WitnessMenu = props => {
  return (
    <Menu
      open={props.witnessMenuOpen}
      onClose={props.handleWitnessMenuClose}
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
        data-test="addCivilianWitness"
        onClick={() => {
          props.handleWitnessMenuClose();
          props.dispatch(
            initialize(CIVILIAN_FORM_NAME, {
              roleOnCase: WITNESS,
              caseId: props.caseDetail.id
            })
          );
          props.dispatch(
            openCivilianDialog("Add Civilian", "Create", createCivilian)
          );
        }}
      >
        Civilian Witness
      </MenuItem>
      <MenuItem
        data-test="addOfficerWitness"
        onClick={() => {
          props.dispatch(
            initialize("OfficerDetails", {
              roleOnCase: WITNESS
            })
          );
          props.dispatch(push(`/cases/${props.caseDetail.id}/officers/search`));
        }}
      >
        Officer Witness
      </MenuItem>
    </Menu>
  );
};

export default WitnessMenu;
