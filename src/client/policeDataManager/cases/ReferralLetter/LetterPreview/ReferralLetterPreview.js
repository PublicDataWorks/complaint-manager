import React, { useEffect } from "react";
import { connect } from "react-redux";
import LetterPreview from "./LetterPreview";
import getReferralLetterData from "../thunks/getReferralLetterData";
import getReferralLetterPreview from "../thunks/getReferralLetterPreview";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";

const ReferralLetterPreview = props => {
  useEffect(() => {
    props.getReferralLetterData(props.match.params.id);
    props.getReferralLetterPreview(props.match.params.id);
  }, []);

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
      lastEdited={props.lastEdited}
      letterAlreadyApproved={letterAlreadyApproved}
      letterHtml={props.letterHtml}
      letterOfficers={props.letterOfficers}
    />
  );
};

const mapStateToProps = state => ({
  addresses: state.referralLetter.addresses,
  draftFilename: state.referralLetter.draftFilename,
  editStatus: state.referralLetter.editStatus,
  lastEdited: state.referralLetter.lastEdited,
  letterHtml: state.referralLetter.letterHtml,
  letterOfficers: state.referralLetter.letterDetails.letterOfficers
});

export default connect(mapStateToProps, {
  getReferralLetterData,
  getReferralLetterPreview
})(ReferralLetterPreview);
