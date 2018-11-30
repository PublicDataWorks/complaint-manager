import React from "react";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import LinkButton from "../../../shared/components/LinkButton";
import config from "../../../config/config";
import inBrowserDownload from "../../thunks/inBrowserDownload";
import {
  startLetterDownload,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";

class DownloadFinalLetterButton extends React.Component {
  startLetterDownload = () => {
    const { startLetterDownload, stopLetterDownload, caseId } = this.props;
    const hostname = config[process.env.NODE_ENV].hostname;
    const apiRouteForSignedS3Link = `${hostname}/api/cases/${caseId}/referral-letter/final-pdf-url`;

    startLetterDownload();
    this.props.inBrowserDownload(
      apiRouteForSignedS3Link,
      "dynamicLetterDownloadLink",
      stopLetterDownload
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
          disabled={this.props.downloadInProgress}
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

const mapDispatchToProps = {
  startLetterDownload,
  inBrowserDownload,
  stopLetterDownload
};

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  status: state.currentCase.details.status,
  downloadInProgress: state.ui.letterDownload.downloadInProgress
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadFinalLetterButton);
