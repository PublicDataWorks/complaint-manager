import React from "react";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import getFinalPdfUrl from "../../ReferralLetter/thunks/getFinalPdfUrl";
import LinkButton from "../../../shared/components/LinkButton";

class DownloadFinalLetterButton extends React.Component {
  startLetterDownload = () => {
    this.props.dispatch(getFinalPdfUrl(this.props.caseId));
  };

  caseStatusAllowsDownloadFinalLetter = () => {
    return [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED].includes(
      this.props.status
    );
  };

  render() {
    if (!this.caseStatusAllowsDownloadFinalLetter()) {
      return "";
    }
    return (
      <LinkButton
        data-test={"download-final-letter-button"}
        style={{ textAlign: "left" }}
        onClick={this.startLetterDownload}
      >
        Download Letter
      </LinkButton>
    );
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  status: state.currentCase.details.status
});

export default connect(mapStateToProps)(DownloadFinalLetterButton);
