import React from "react";
import LinkButton from "../../../shared/components/LinkButton";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import {
  selectCaseOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import { initialize } from "redux-form";
import { openRemovePersonDialog } from "../../../actionCreators/casesActionCreators";

const OfficerActions = ({ caseOfficer, dispatch }) => (
  <div style={{ display: "flex" }}>
    <LinkButton
      data-test="editOfficerLink"
      onClick={event => {
        event.stopPropagation();

        if (caseOfficer.officerId) {
          dispatch(selectCaseOfficer(caseOfficer));
        } else {
          dispatch(selectUnknownOfficer());
        }
        dispatch(
          initialize("OfficerDetails", {
            notes: caseOfficer.notes,
            roleOnCase: caseOfficer.roleOnCase,
            officerId: caseOfficer.officerId
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
