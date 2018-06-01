import React from "react";
import LinkButton from "../../../shared/components/LinkButton";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import {
  selectOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import { initialize } from "redux-form";

const OfficerActions = ({ caseOfficer, dispatch }) => (
  <div>
    <LinkButton
      data-test="editOfficerLink"
      onClick={event => {
        event.stopPropagation();

        if (caseOfficer.officerId) {
          dispatch(selectOfficer(caseOfficer));
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
      style={{ visibility: "hidden" }}
      data-test="removeOfficerLink"
      onClick={event => {
        event.stopPropagation();
      }}
    >
      Remove
    </LinkButton>
  </div>
);

export default connect()(OfficerActions);
