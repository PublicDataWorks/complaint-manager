import React, { useEffect } from "react";
import { connect } from "react-redux";
import LetterPreview, { SUBMIT_BUTTON_TYPE } from "./LetterPreview";
import getReferralLetterData from "../thunks/getReferralLetterData";
import getReferralLetterPreview from "../thunks/getReferralLetterPreview";
import {
  CASE_STATUS,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";

const ReferralLetterPreview = props => {
  useEffect(() => {
    props.getReferralLetterData(props.match.params.id);
    props.getReferralLetterPreview(props.match.params.id);
  }, []);

  const determineSubmitButtonType = () => {
    if (
      props.caseDetails.status === CASE_STATUS.READY_FOR_REVIEW &&
      props.userInfo &&
      props.userInfo.permissions.includes(
        USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES
      )
    ) {
      return SUBMIT_BUTTON_TYPE.REVIEW_AND_APPROVE_BTN;
    } else if (
      props.caseDetails.status === CASE_STATUS.LETTER_IN_PROGRESS &&
      props.userInfo.permissions?.includes(USER_PERMISSIONS.SETUP_LETTER)
    ) {
      return SUBMIT_BUTTON_TYPE.SUBMIT_FOR_REVIEW_BTN;
    }
  };

  const letterAlreadyApproved = status => {
    return ![
      CASE_STATUS.LETTER_IN_PROGRESS,
      CASE_STATUS.READY_FOR_REVIEW
    ].includes(status);
  };

  return (
    <LetterPreview
      addresses={props.addresses}
      caseId={props.match.params.id}
      draftFilename={props.draftFilename}
      editAddressUrl={`api/cases/${props.match.params.id}/referral-letter/addresses`}
      editStatus={props.editStatus}
      getPdfEndpoint="referral-letter/get-pdf"
      editLetterEndpoint={"letter/edit-letter"}
      lastEdited={props.lastEdited}
      letterAlreadyApproved={letterAlreadyApproved}
      letterHtml={props.letterHtml}
      letterOfficers={props.letterOfficers}
      submitButtonType={determineSubmitButtonType()}
    />
  );
};

const mapStateToProps = state => ({
  addresses: state.referralLetter.addresses,
  caseDetails: state.currentCase.details,
  draftFilename: state.referralLetter.draftFilename,
  editStatus: state.referralLetter.editStatus,
  lastEdited: state.referralLetter.lastEdited,
  letterHtml: state.referralLetter.letterHtml,
  letterOfficers: state.referralLetter.letterDetails.letterOfficers,
  userInfo: state.users.current.userInfo
});

export default connect(mapStateToProps, {
  getReferralLetterData,
  getReferralLetterPreview
})(ReferralLetterPreview);
