import React from "react";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import LinkButton from "../../../shared/components/LinkButton";
import config from "../../../config/config";
import inBrowserDownload from "../../thunks/inBrowserDownload";

class DownloadFinalLetterButton extends React.Component {
  startLetterDownload = () => {
    const hostname = config[process.env.NODE_ENV].hostname;
    const apiRouteForSignedS3Link = `${hostname}/api/cases/${
      this.props.caseId
    }/referral-letter/final-pdf-url`;
    this.props.dispatch(
      inBrowserDownload(apiRouteForSignedS3Link, "dynamicLetterDownloadLink")
    );
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
      <div>
        <LinkButton
          data-test={"download-final-letter-button"}
          style={{ textAlign: "left" }}
          onClick={this.startLetterDownload}
        >
          Download Letter
        </LinkButton>
        <a id="dynamicLetterDownloadLink" href="#dynamicLetterDownloadLink">
          {" "}
        </a>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  status: state.currentCase.details.status
});

export default connect(mapStateToProps)(DownloadFinalLetterButton);
