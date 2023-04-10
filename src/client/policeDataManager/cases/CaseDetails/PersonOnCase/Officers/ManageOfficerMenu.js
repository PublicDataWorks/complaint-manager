import React, { useState } from "react";
import { push } from "connected-react-router";
import { Menu, MenuItem } from "@material-ui/core";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import LinkButton from "../../../../shared/components/LinkButton";
import {
  addCaseEmployeeType,
  selectCaseOfficer,
  selectUnknownOfficer
} from "../../../../actionCreators/officersActionCreators";
import {
  CONFIGS,
  OFFICER_DETAILS_FORM_NAME,
  OFFICER_TITLE
} from "../../../../../../sharedUtilities/constants";
import useMenuControl from "../../../../../common/hooks/useMenuControl";
import axios from "axios";
import ConfirmationDialog from "../../../../shared/components/ConfirmationDialog";
import { snackbarSuccess } from "../../../../actionCreators/snackBarActionCreators";
import { removePersonSuccess } from "../../../../actionCreators/casesActionCreators";

const ManageOfficerMenu = props => {
  const { menuOpen, anchorEl, handleMenuOpen, handleMenuClose } =
    useMenuControl();

  const { caseOfficer, pd, dispatch } = props;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
            setDeleteDialogOpen(true);
          }}
        >
          {`Remove ${caseEmployeeTitle}`}
        </MenuItem>
      </Menu>
      {deleteDialogOpen ? (
        <ConfirmationDialog
          confirmText="Remove"
          onConfirm={() => {
            axios
              .delete(
                `api/cases/${caseOfficer.caseId}/cases-officers/${caseOfficer.id}`
              )
              .then(result => {
                dispatch(
                  snackbarSuccess(
                    `${caseOfficer.caseEmployeeType} was successfully removed`
                  )
                );
                setDeleteDialogOpen(false);
                dispatch(removePersonSuccess(result.data));
              })
              .catch(error => {
                console.log(error);
              });
          }}
          onCancel={() => setDeleteDialogOpen(false)}
          open={deleteDialogOpen}
          title={`Remove ${caseOfficer.caseEmployeeType}`}
        >
          This action will remove <strong>{caseOfficer.fullName}</strong> and
          all information associated to this person from the case. Are you sure
          you want to continue?
        </ConfirmationDialog>
      ) : (
        ""
      )}
    </div>
  );
};

export default connect(state => ({ pd: state.configs[CONFIGS.PD] }))(
  ManageOfficerMenu
);
