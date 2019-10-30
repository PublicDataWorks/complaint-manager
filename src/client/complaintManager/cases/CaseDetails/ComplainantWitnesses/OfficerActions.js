import React from "react";
import LinkButton from "../../../shared/components/LinkButton";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  addCaseEmployeeType,
  selectCaseOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import { initialize } from "redux-form";

import { OFFICER_DETAILS_FORM_NAME } from "../../../../../sharedUtilities/constants";
import { openRemovePersonDialog } from "../../../actionCreators/casesActionCreators";

const OfficerActions = ({ caseOfficer, dispatch }) => (
  <div style={{ display: "flex" }}>
    <LinkButton
      data-test="editOfficerLink"
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
      data-test="removeOfficerLink"
      onClick={event => {
        event.stopPropagation();
        dispatch(openRemovePersonDialog(caseOfficer, "cases-officers"));
      }}
    >
      Remove
    </LinkButton>
  </div>
);

export default connect()(OfficerActions);
