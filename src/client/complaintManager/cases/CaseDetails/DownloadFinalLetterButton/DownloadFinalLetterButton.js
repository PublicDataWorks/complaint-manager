import React from "react";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import LinkButton from "../../../shared/components/LinkButton";
import inBrowserDownload from "../../thunks/inBrowserDownload";
import {
  startLetterDownload,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";
import styles from "../../../../common/globalStyling/styles";

class DownloadFinalLetterButton extends React.Component {
  startLetterDownload = () => {
    const { startLetterDownload, stopLetterDownload, caseId } = this.props;
    const apiRouteForSignedS3Link = `api/cases/${caseId}/referral-letter/final-pdf-download-url`;

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

  noFileAvailableMessage = () => {
    if (!this.props.pdfAvailable) {
      return (
        <div
          data-testid="no-file-for-download-message"
          style={{ marginLeft: "16px" }}
        >
          <i style={styles.caption}>
            This case does not have a letter for download
          </i>
        </div>
      );
    }
  };

  render() {
    if (!this.caseStatusAllowsDownloadFinalLetter()) {
      return "";
    }
    return (
      <div>
        <LinkButton
          data-testid={"download-final-letter-button"}
          style={{ textAlign: "left" }}
          onClick={this.startLetterDownload}
          disabled={this.props.downloadInProgress || !this.props.pdfAvailable}
        >
          Download Letter
        </LinkButton>
        {this.noFileAvailableMessage()}
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
  pdfAvailable: state.currentCase.details.pdfAvailable,
  downloadInProgress: state.ui.letterDownload.downloadInProgress
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadFinalLetterButton);
