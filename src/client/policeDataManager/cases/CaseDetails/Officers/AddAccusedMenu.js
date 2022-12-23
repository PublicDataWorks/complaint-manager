import LinkButton from "../../../shared/components/LinkButton";
import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { initialize } from "redux-form";
import {
  ACCUSED,
  CONFIGS,
  OFFICER_DETAILS_FORM_NAME,
  OFFICER_TITLE
} from "../../../../../sharedUtilities/constants";
import { push } from "connected-react-router";
import { addCaseEmployeeType } from "../../../actionCreators/officersActionCreators";
import { connect } from "react-redux";
import useMenuControl from "../../../../common/hooks/useMenuControl";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const AddAccusedMenu = props => {
  const { menuOpen, anchorEl, handleMenuOpen, handleMenuClose } =
    useMenuControl();

  return (
    <div>
      <LinkButton
        style={{
          marginLeft: "8px",
          marginTop: "8px",
          marginBottom: "8px"
        }}
        onClick={handleMenuOpen}
        data-testid="addAccusedMenu"
      >
        + Add Accused
      </LinkButton>
      <Menu
        data-testid="addAccusedMenu"
        open={menuOpen}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
      >
        <MenuItem
          data-testid="addAccusedOfficer"
          onClick={() => {
            handleMenuClose();
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
            handleMenuClose();
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
          Accused Civilian ({props.pd})
        </MenuItem>
      </Menu>
    </div>
  );
};

export default connect(state => ({
  pd: state.configs[CONFIGS.PD]
}))(AddAccusedMenu);
