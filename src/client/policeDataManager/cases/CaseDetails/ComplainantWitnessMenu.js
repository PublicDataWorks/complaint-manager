import {
  CIVILIAN_FORM_NAME,
  CONFIGS,
  OFFICER_DETAILS_FORM_NAME,
  OFFICER_TITLE,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { push } from "connected-react-router";
import createCivilian from "../thunks/createCivilian";
import { initialize } from "redux-form";
import { openCivilianDialog } from "../../actionCreators/casesActionCreators";
import { Menu, MenuItem } from "@material-ui/core";
import React, { useState } from "react";
import LinkButton from "../../shared/components/LinkButton";
import { addCaseEmployeeType } from "../../actionCreators/officersActionCreators";
import { connect } from "react-redux";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const ComplainantWitnessMenu = props => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = event => {
    setMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <div>
      {props.permissions?.includes(USER_PERMISSIONS.EDIT_CASE) ? (
        <LinkButton
          style={{
            marginLeft: "8px",
            marginTop: "8px",
            marginBottom: "8px"
          }}
          onClick={handleMenuOpen}
          data-testid="addComplainantWitness"
        >
          + Add {props.civilianType}
        </LinkButton>
      ) : (
        ""
      )}
      <Menu
        open={menuOpen}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
      >
        <MenuItem
          data-testid="addCivilianComplainantWitness"
          onClick={() => {
            handleMenuClose();
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
            props.dispatch(
              addCaseEmployeeType(PERSON_TYPE.KNOWN_OFFICER.employeeDescription)
            );
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
              addCaseEmployeeType(
                PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
              )
            );
            props.dispatch(
              push(`/cases/${props.caseDetails.id}/officers/search`)
            );
          }}
        >
          Civilian ({props.pd}) {props.civilianType}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default connect(state => ({
  pd: state.configs[CONFIGS.PD],
  permissions: state?.users?.current?.userInfo?.permissions
}))(ComplainantWitnessMenu);
