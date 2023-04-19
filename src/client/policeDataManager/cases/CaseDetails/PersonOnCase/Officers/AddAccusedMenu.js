import React from "react";
import { push } from "connected-react-router";
import { initialize } from "redux-form";
import { connect } from "react-redux";
import { Menu, MenuItem } from "@material-ui/core";
import LinkButton from "../../../../shared/components/LinkButton";
import {
  ACCUSED,
  CONFIGS,
  OFFICER_DETAILS_FORM_NAME
} from "../../../../../../sharedUtilities/constants";
import { addCaseEmployeeType } from "../../../../actionCreators/officersActionCreators";
import useMenuControl from "../../../../../common/hooks/useMenuControl";

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
        {props.personTypes
          .filter(type => type.isEmployee && !type.key.includes("UNKNOWN"))
          .map(type => (
            <MenuItem
              key={type.key}
              data-testid={`addAccused${type.employeeDescription}`}
              onClick={() => {
                handleMenuClose();
                props.dispatch(
                  initialize(OFFICER_DETAILS_FORM_NAME, {
                    roleOnCase: ACCUSED
                  })
                );
                props.dispatch(addCaseEmployeeType(type.employeeDescription));
                props.dispatch(push(`/cases/${props.caseId}/officers/search`));
              }}
            >
              Accused{" "}
              {type.key.includes("CIVILIAN")
                ? type.description
                : type.employeeDescription}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default connect(state => ({
  personTypes: state.personTypes
}))(AddAccusedMenu);
