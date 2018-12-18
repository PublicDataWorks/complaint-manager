import React, { Component } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import NavBar from "../../../shared/components/NavBar/NavBar";
import LinkButton from "../../../shared/components/LinkButton";
import getLetterPreview from "../thunks/getLetterPreview";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import getPdf from "../thunks/getPdf";
import { withStyles } from "@material-ui/core/styles";
import { push } from "react-router-redux";

import {
  getLetterPdfSuccess,
  startLetterDownload
} from "../../../actionCreators/letterActionCreators";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { dateTimeFromString } from "../../../utilities/formatDate";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import UpdateCaseStatusDialog from "../../CaseDetails/UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import approveReferralLetter from "../thunks/approveReferralLetter";
import {
  CASE_STATUS,
  LETTER_TYPE
} from "../../../../sharedUtilities/constants";
import PageLoading from "../../../shared/components/PageLoading";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const styles = theme => ({
  pageStyling: {
    borderBottom: `${theme.palette.secondary.main} 1px dotted`,
    "&:last-child": { borderBottom: "none" }
  }
});
class ReviewAndApproveLetter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caseId: this.props.match.params.id,
      numPages: null
    };
  }

  componentWillUnmount() {
    this.props.getLetterPdfSuccess(null);
  }

  componentDidMount() {
    this.props.getLetterPreview(this.state.caseId);
    this.props.startLetterDownload();
    this.props.getPdf(this.state.caseId, this.props.finalFilename);
  }

  componentDidUpdate() {
    if (!this.letterPreviewNotYetLoaded() && !this.statusIsAllowed()) {
      this.props.redirect(this.state.caseId);
    }
  }

  statusIsAllowed = () => {
    return this.props.status === CASE_STATUS.READY_FOR_REVIEW;
  };

  letterPreviewNotYetLoaded = () => {
    return this.props.letterPdf === null;
  };

  getTimestamp() {
    let message;
    if (this.props.letterType === null) {
      return;
    }
    if (this.props.letterType === LETTER_TYPE.EDITED) {
      const editedDate = dateTimeFromString(this.props.lastEdited);
      message = `This letter was last edited on ${editedDate}`;
    } else {
      const now = dateTimeFromString(new Date());
      message = `This letter was generated on ${now}`;
    }
    return <i>{message}</i>;
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
      loadedPages: 0
    });
  };

  openUpdateCaseDialog = () => {
    this.props.openCaseStatusUpdateDialog();
  };

  renderPages = () => {
    return Array.from(new Array(this.state.numPages), (el, index) => (
      <Page
        key={`page_${index + 1}`}
        pageNumber={index + 1}
        scale={1.3}
        onLoadSuccess={() => {
          this.setState({
            loadedPages: this.state.loadedPages + 1
          });
        }}
        className={this.props.classes.pageStyling}
      />
    ));
  };

  render() {
    if (this.letterPreviewNotYetLoaded()) {
      return <PageLoading />;
    }

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${this.props.caseNumber}   : Letter Generation`}
          </Typography>
        </NavBar>

        <LinkButton
          data-test="save-and-return-to-case-link"
          to={`/cases/${this.state.caseId}`}
          component={Link}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Back to Case
        </LinkButton>
        <div style={{ margin: "0% 5% 3%", maxWidth: "54rem" }}>
          <Typography
            style={{
              marginBottom: "24px"
            }}
            variant="title"
            data-test="review-and-approve-page-header"
          >
            Review and Approve Letter
          </Typography>
          <Typography
            data-test="edit-history"
            variant="body1"
            style={{ marginBottom: "24px" }}
          >
            {this.getTimestamp()}
          </Typography>
          <Card
            style={{
              marginBottom: "24px",
              backgroundColor: "white",
              overflow: "auto",
              overflowX: "hidden",
              width: "54rem",
              maxHeight: "55rem"
            }}
          >
            <CardContent>
              <div
                style={{
                  display:
                    this.state.numPages === this.state.loadedPages ? "" : "none"
                }}
              >
                <Document
                  file={this.props.letterPdf}
                  onLoadSuccess={this.onDocumentLoadSuccess}
                  noData=""
                >
                  {this.renderPages()}
                </Document>
              </div>
              <div style={{ textAlign: "center", marginTop: "8px" }}>
                <CircularProgress
                  data-test={"download-letter-progress"}
                  size={25}
                  style={{
                    display:
                      this.state.loadedPages !== this.state.numPages
                        ? ""
                        : "none"
                  }}
                />
              </div>
            </CardContent>
          </Card>
          <div style={{ textAlign: "right" }}>
            <PrimaryButton
              onClick={this.openUpdateCaseDialog}
              data-test="approve-letter-button"
            >
              Approve Letter
            </PrimaryButton>
          </div>
          <UpdateCaseStatusDialog
            alternativeAction={this.props.approveReferralLetter}
            doNotCallUpdateStatusCallback={true}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  letterType: state.referralLetter.letterType,
  lastEdited: state.referralLetter.lastEdited,
  finalFilename: state.referralLetter.finalFilename,
  letterPdf: state.referralLetter.letterPdf,
  downloadInProgress: state.ui.letterDownload.downloadInProgress,
  caseNumber: state.currentCase.details.caseNumber,
  status: state.currentCase.details.status
});

const mapDispatchToProps = {
  getLetterPreview,
  getPdf,
  startLetterDownload,
  openCaseStatusUpdateDialog,
  approveReferralLetter,
  getLetterPdfSuccess,
  redirect: (caseId, callback) => async dispatch =>
    dispatch(push(`/cases/${caseId}`))
};

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReviewAndApproveLetter)
);
