import React, { useEffect } from "react";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import EditLetter from "./EditLetter";
import editReferralLetterContent from "../thunks/editReferralLetterContent";
import getReferralLetterPreview from "../thunks/getReferralLetterPreview";
import {
  EDIT_LETTER_HTML_FORM,
  CASE_STATUS
} from "../../../../../sharedUtilities/constants";

const EditReferralLetter = props => {
  useEffect(() => {
    props.getReferralLetterPreview(props.match.params.id);
  }, []);

  const setInitialValues = () => {
    props.initialize(EDIT_LETTER_HTML_FORM, props.initialValues);
  };

  const isCaseStatusValid = () => {
    const allowed_statuses_for_edit_letter = [
      CASE_STATUS.LETTER_IN_PROGRESS,
      CASE_STATUS.READY_FOR_REVIEW
    ];
    return (
      props.caseStatus &&
      allowed_statuses_for_edit_letter.includes(props.caseStatus)
    );
  };

  return (
    <EditLetter
      caseId={props.match.params.id}
      letterPreviewEndpoint={"letter-preview"}
      letterHtml={props.initialValues.editedLetterHtml}
      editContent={(values, redirectUrl) =>
        props.editReferralLetterContent(
          props.match.params.id,
          values,
          redirectUrl
        )
      }
      editLetterEndpoint={"letter/edit-letter"}
      initialValues={props.initialValues}
      setInitialValues={() => setInitialValues()}
      isCaseStatusValid={isCaseStatusValid}
      useLetterProgressStepper={true}
      caseReference={props.caseReference}
    />
  );
};

const mapStateToProps = state => ({
  caseReference: state.currentCase.details.caseReference,
  caseStatus: state.currentCase.details.status,
  initialValues: { editedLetterHtml: state.referralLetter.letterHtml }
});

export default connect(mapStateToProps, {
  editReferralLetterContent,
  getReferralLetterPreview,
  initialize
})(EditReferralLetter);
