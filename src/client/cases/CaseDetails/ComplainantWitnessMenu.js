import {
  CIVILIAN_FORM_NAME,
  OFFICER_DETAILS_FORM_NAME
} from "../../../sharedUtilities/constants";
import { push } from "connected-react-router";
import createCivilian from "../thunks/createCivilian";
import { initialize } from "redux-form";
import { openCivilianDialog } from "../../actionCreators/casesActionCreators";
import { Menu, MenuItem } from "@material-ui/core";
import React from "react";
import LinkButton from "../../shared/components/LinkButton";

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
        data-test="addComplainantWitness"
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
          data-test="addCivilianComplainantWitness"
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
          data-test="addOfficerComplainantWitness"
          onClick={() => {
            props.dispatch(
              initialize(OFFICER_DETAILS_FORM_NAME, {
                roleOnCase: props.civilianType
              })
            );
            props.dispatch(
              push(`/cases/${props.caseDetails.id}/officers/search`)
            );
          }}
        >
          Officer {props.civilianType}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ComplainantWitnessMenu;
