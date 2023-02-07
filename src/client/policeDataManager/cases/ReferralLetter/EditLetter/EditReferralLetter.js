import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import EditLetter from "./EditLetter";
import editReferralLetterContent from "../thunks/editReferralLetterContent";
import getReferralLetterPreview from "../thunks/getReferralLetterPreview";
import {
  EDIT_LETTER_HTML_FORM,
  CASE_STATUS
} from "../../../../../sharedUtilities/constants";

const EditReferralLetter = props => {
  const setInitialValues = () => {
    dispatch(initialize(EDIT_LETTER_HTML_FORM, props.initialValues));
  };

  const invalidCaseStatus = caseStatus => {
    const allowed_statuses_for_edit_letter = [
      CASE_STATUS.LETTER_IN_PROGRESS,
      CASE_STATUS.READY_FOR_REVIEW
    ];
    return !allowed_statuses_for_edit_letter.includes(caseStatus);
  };

  return (
    <EditLetter
      caseId={props.match.params.id}
      letterPreviewEndpoint={"letter-preview"}
      editContent={() => props.editReferralLetterContent()}
      editLetterEndpoint={"letter/edit-letter"}
      getLetterPreview={() => props.getReferralLetterPreview()}
      initialValues={props.initialValues}
      setInitialValues={() => setInitialValues()}
      checkCaseStatus={() => invalidCaseStatus()}
    />
  );
};

const mapStateToProps = state => ({
  initialValues: { editedLetterHtml: state.referralLetter.letterHtml }
});

export default connect(mapStateToProps, {
  editReferralLetterContent,
  getReferralLetterPreview
})(EditReferralLetter);
