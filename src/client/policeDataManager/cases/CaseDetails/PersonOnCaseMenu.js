import React from "react";
import {
  CIVILIAN_FORM_NAME,
  CONFIGS,
  OFFICER_DETAILS_FORM_NAME,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { push } from "connected-react-router";
import createCivilian from "../thunks/createCivilian";
import { initialize } from "redux-form";
import { openCivilianDialog } from "../../actionCreators/casesActionCreators";
import { Menu, MenuItem } from "@material-ui/core";
import LinkButton from "../../shared/components/LinkButton";
import { addCaseEmployeeType } from "../../actionCreators/officersActionCreators";
import { connect } from "react-redux";
import useMenuControl from "../../../common/hooks/useMenuControl";

const PersonOnCaseMenu = props => {
  const { menuOpen, anchorEl, handleMenuOpen, handleMenuClose } =
    useMenuControl();

  const launchDialog = () => {
    props.dispatch(
      initialize(CIVILIAN_FORM_NAME, {
        roleOnCase: props.civilianType,
        caseId: props.caseDetails.id
      })
    );
    props.dispatch(
      openCivilianDialog(
        props.choosePersonTypeInAddDialog
          ? "Add Person to Case"
          : "Add Civilian",
        "Create",
        createCivilian
      )
    );
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
          onClick={
            props.choosePersonTypeInAddDialog ? launchDialog : handleMenuOpen
          }
          data-testid="addPersonOnCase"
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
          data-testid="addCivilianPersonOnCase"
          onClick={() => {
            handleMenuClose();
            launchDialog();
          }}
        >
          Civilian {props.civilianType}
        </MenuItem>
        {props.personTypes
          .filter(type => type.isEmployee && !type.key.includes("UNKNOWN"))
          .map(type => (
            <MenuItem
              key={type.key}
              data-testid={`add${type.employeeDescription}PersonOnCase`}
              onClick={() => {
                props.dispatch(
                  initialize(OFFICER_DETAILS_FORM_NAME, {
                    roleOnCase: props.civilianType
                  })
                );
                props.dispatch(addCaseEmployeeType(type.employeeDescription));
                props.dispatch(
                  push(`/cases/${props.caseDetails.id}/officers/search`)
                );
              }}
            >
              {type.key.includes("CIVILIAN")
                ? type.description
                : type.employeeDescription}{" "}
              {props.civilianType}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default connect(state => ({
  choosePersonTypeInAddDialog: state.featureToggles.choosePersonTypeInAddDialog,
  permissions: state?.users?.current?.userInfo?.permissions,
  personTypes: state.personTypes
}))(PersonOnCaseMenu);
