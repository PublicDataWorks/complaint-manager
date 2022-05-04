import React, { Component } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import NavBar from "../../../shared/components/NavBar/NavBar";
import LinkButton from "../../../shared/components/LinkButton";
import getReferralLetterPreview from "../thunks/getReferralLetterPreview";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import getReferralLetterPdf from "../thunks/getReferralLetterPdf";
import { withStyles } from "@material-ui/core/styles";

import { getReferralLetterPdfSuccess } from "../../../actionCreators/letterActionCreators";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { dateTimeFromString } from "../../../../../sharedUtilities/formatDate";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import UpdateCaseStatusDialog from "../../CaseDetails/UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import approveReferralLetter from "../thunks/approveReferralLetter";
import {
  CASE_STATUS,
  EDIT_STATUS
} from "../../../../../sharedUtilities/constants";
import PageLoading from "../../../shared/components/PageLoading";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";
import { policeDataManagerMenuOptions } from "../../../shared/components/NavBar/policeDataManagerMenuOptions";

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
      numPages: null,
      loadingPdfPreview: false
    };
  }

  componentWillUnmount() {
    this.props.getReferralLetterPdfSuccess(null);
  }

  componentDidMount() {
    this.props.getReferralLetterPreview(this.state.caseId);
    this.setState({ loadingPdfPreview: true });
    this.props.getReferralLetterPdf(this.state.caseId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.letterPreviewNotYetLoaded() && !this.statusIsAllowed()) {
      this.props.invalidCaseStatusRedirect(this.state.caseId);
    }
    if (
      this.state.loadedPages === this.state.numPages &&
      this.state.loadingPdfPreview
    ) {
      this.setState({ loadingPdfPreview: false });
    }
  }

  statusIsAllowed = () => {
    return (
      !this.props.status || this.props.status === CASE_STATUS.READY_FOR_REVIEW
    );
  };

  letterPreviewNotYetLoaded = () => {
    return this.props.letterPdf === null;
  };

  getTimestamp() {
    let message;
    if (this.props.editStatus === null) {
      return;
    }
    if (this.props.editStatus === EDIT_STATUS.EDITED) {
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
    this.props.openCaseStatusUpdateDialog(this.props.nextStatus);
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
      <div data-testid="review-and-approve-letter">
        <NavBar menuType={policeDataManagerMenuOptions}>
          {`Case #${this.props.caseReference}   : Letter Generation`}
        </NavBar>

        <LinkButton
          data-testid="save-and-return-to-case-link"
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
            variant="h6"
            data-testid="review-and-approve-page-header"
          >
            Review and Approve Letter
          </Typography>
          <Typography
            data-testid="edit-history"
            variant="body2"
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
                  display: this.state.loadingPdfPreview ? "none" : ""
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
                  data-testid={"download-letter-progress"}
                  size={25}
                  style={{
                    display: this.state.loadingPdfPreview ? "" : "none"
                  }}
                />
              </div>
            </CardContent>
          </Card>
          <div style={{ textAlign: "right" }}>
            <PrimaryButton
              onClick={this.openUpdateCaseDialog}
              data-testid="approve-letter-button"
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
  editStatus: state.referralLetter.editStatus,
  lastEdited: state.referralLetter.lastEdited,
  letterPdf: state.referralLetter.letterPdf,
  caseReference: state.currentCase.details.caseReference,
  status: state.currentCase.details.status,
  nextStatus: state.currentCase.details.nextStatus
});

const mapDispatchToProps = {
  getReferralLetterPreview,
  getReferralLetterPdf,
  openCaseStatusUpdateDialog,
  approveReferralLetter,
  getReferralLetterPdfSuccess,
  invalidCaseStatusRedirect
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(ReviewAndApproveLetter)
);
