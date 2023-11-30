import React, { useState } from "react";
import LinkButton from "../../../shared/components/LinkButton";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  addCaseEmployeeType,
  selectCaseOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import { initialize } from "redux-form";

import {
  CONFIGS,
  OFFICER_DETAILS_FORM_NAME
} from "../../../../../sharedUtilities/constants";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import axios from "axios";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";
import { removePersonSuccess } from "../../../actionCreators/casesActionCreators";

const OfficerActions = ({ caseOfficer, dispatch }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <div style={{ display: "flex" }}>
      <LinkButton
        data-testid="editOfficerLink"
        onClick={event => {
          event.stopPropagation();

          if (caseOfficer.officerId) {
            dispatch(selectCaseOfficer(caseOfficer));
            dispatch(addCaseEmployeeType(caseOfficer.caseEmployeeType));
          } else {
            dispatch(selectUnknownOfficer());
          }
          dispatch(
            initialize(OFFICER_DETAILS_FORM_NAME, {
              notes: caseOfficer.notes,
              roleOnCase: caseOfficer.roleOnCase,
              officerId: caseOfficer.officerId,
              isAnonymous: caseOfficer.isAnonymous,
              phoneNumber: caseOfficer.phoneNumber,
              email: caseOfficer.email
            })
          );
          dispatch(
            push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
          );
        }}
      >
        Edit
      </LinkButton>
      <LinkButton
        data-testid="removeOfficerLink"
        onClick={event => {
          event.stopPropagation();
          setDeleteDialogOpen(true);
        }}
      >
        Remove
      </LinkButton>
      {deleteDialogOpen && (
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
              .catch(() => {});
          }}
          onCancel={() => setDeleteDialogOpen(false)}
          open={deleteDialogOpen}
          title={`Remove ${caseOfficer.caseEmployeeType}`}
        >
          This action will remove <strong>{caseOfficer.fullName}</strong> and
          all information associated to this person from the case. Are you sure
          you want to continue?
        </ConfirmationDialog>
      )}
    </div>
  );
};

export default connect(state => ({ pd: state.configs[CONFIGS.PD] }))(
  OfficerActions
);
