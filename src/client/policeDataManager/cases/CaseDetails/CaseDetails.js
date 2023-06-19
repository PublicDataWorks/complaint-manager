import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NavBar from "../../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import Narrative from "./Narrative";
import Complainants from "./PersonOnCase/Complainants";
import PersonOnCaseDialog from "./PersonOnCaseDialog/PersonOnCaseDialog";
import getCaseDetails from "../thunks/getCaseDetails";
import * as _ from "lodash";
import Attachments from "./Attachments/Attachments";
import styles from "./caseDetailsStyles";
import CaseDrawer from "./CaseDrawer";
import IncidentDetails from "./IncidentDetails/IncidentDetails";
import {
  closeCaseNoteDialog,
  closeCaseTagDialog,
  closeCaseStatusUpdateDialog,
  closeEditCivilianDialog,
  closeEditIncidentDetailsDialog,
  closeRemoveAttachmentConfirmationDialog,
  closeRemoveCaseNoteDialog,
  closeRemoveCaseTagDialog,
  closeRestoreArchivedCaseDialog,
  editSearchIndex
} from "../../actionCreators/casesActionCreators";
import {
  CASE_STATUS,
  NARRATIVE_FORM
} from "../../../../sharedUtilities/constants";
import Accused from "./PersonOnCase/Accused";
import CaseNoteDialog from "./CaseNoteDialog/CaseNoteDialog";
import { clearOfficerPanelData } from "../../actionCreators/accusedOfficerPanelsActionCreators";
import Witnesses from "./PersonOnCase/Witnesses";
import CaseStatusStepper from "./CaseStatusStepper/CaseStatusStepper";
import LetterStatusMessage, {
  PAGE_TYPE
} from "./LetterStatusMessage/LetterStatusMessage";
import getReferralLetterEditStatus from "../ReferralLetter/thunks/getReferralLetterEditStatus";
import { scrollToTop } from "../../../ScrollToTop";
import { reset } from "redux-form";
import { policeDataManagerMenuOptions } from "../../shared/components/NavBar/policeDataManagerMenuOptions";
import { clearHighlightedCaseNote } from "../../actionCreators/highlightCaseNoteActionCreators";
import history from "../../../history";

const drawerWidthPercentage = "30%";
const appBar = {
  position: "absolute",
  marginLeft: drawerWidthPercentage,
  width: `calc(100% - ${drawerWidthPercentage})`
};

export const resetCaseDetailsPage = dispatch => {
  dispatch(reset(NARRATIVE_FORM));
  dispatch(clearOfficerPanelData());
  dispatch(closeEditCivilianDialog());
  dispatch(closeCaseNoteDialog());
  dispatch(closeCaseTagDialog());
  dispatch(closeCaseStatusUpdateDialog());
  dispatch(closeRemoveCaseNoteDialog());
  dispatch(closeRemoveCaseTagDialog());
  dispatch(closeEditIncidentDetailsDialog());
  dispatch(closeRestoreArchivedCaseDialog());
  dispatch(closeRemoveAttachmentConfirmationDialog());
};

class CaseDetails extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      !prevProps.caseDetails.isArchived &&
      this.props.caseDetails.isArchived
    ) {
      scrollToTop();
    }
  }

  state = {
    mobileOpen: false
  };

  componentDidMount() {
    const caseId = this.props.match.params.id;
    this.props.dispatch(getCaseDetails(caseId));
    this.props.dispatch(getReferralLetterEditStatus(caseId));

    history.listen((location, action) => {
      if (action === "PUSH") {
        resetCaseDetailsPage(this.props.dispatch);
      }
      if (action === "POP") {
        this.props.dispatch(clearHighlightedCaseNote());
      }
    });
  }

  componentWillUnmount() {
    resetCaseDetailsPage(this.props.dispatch);
    this.props.dispatch(clearHighlightedCaseNote());

    if (this.props.searchableDataIsDirty) {
      this.props.dispatch(editSearchIndex());
    }
  }

  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetails) ||
      `${this.props.caseDetails.id}` !== this.props.match.params.id
    );
  }

  navigateCaseToCase() {
    const caseId = this.props.match.params.id;
    if (
      this.props.caseDetails.id &&
      `${this.props.caseDetails.id}` !== caseId
    ) {
      this.props.dispatch(getCaseDetails(caseId));
    }
  }

  render() {
    this.navigateCaseToCase();

    if (this.caseDetailsNotYetLoaded()) {
      return null;
    }

    const statusIsClosed = this.props.caseDetails.status === CASE_STATUS.CLOSED;
    const status = this.props.caseDetails.status;

    const { classes } = this.props;

    return (
      <div className={classes.root} data-testid="case-details-page">
        <div className={classes.appFrame}>
          <NavBar
            menuType={policeDataManagerMenuOptions}
            showHome={false}
            customStyle={appBar}
          >
            <div className={classes.caseReference} data-testid="caseReference">
              {`Case #${this.props.caseDetails.caseReference}`}
            </div>
            <Typography
              data-testid="caseStatusBox"
              variant="caption"
              color="inherit"
              className={`${classes.statusBox} ${
                statusIsClosed
                  ? classes.closedStatusBox
                  : classes.activeStatusBox
              }`}
            >
              {status}
            </Typography>
          </NavBar>
          <CaseDrawer classes={classes} caseDetails={this.props.caseDetails} />
          <main className={classes.content}>
            <CaseStatusStepper />
            <div style={{ marginLeft: "5%", marginRight: "5%" }}>
              <LetterStatusMessage pageType={PAGE_TYPE.CASE_DETAILS} />
            </div>
            <IncidentDetails classes={classes} />
            <Complainants
              caseDetails={this.props.caseDetails}
              dispatch={this.props.dispatch}
              classes={classes}
            />
            <Witnesses
              caseDetails={this.props.caseDetails}
              dispatch={this.props.dispatch}
              classes={classes}
            />
            <Narrative
              initialValues={{
                narrativeDetails: this.props.caseDetails.narrativeDetails,
                narrativeSummary: this.props.caseDetails.narrativeSummary
              }}
              caseId={this.props.caseDetails.id}
              isArchived={this.props.caseDetails.isArchived}
            />
            <Accused caseDetails={this.props.caseDetails} classes={classes} />
            <Attachments isArchived={this.props.caseDetails.isArchived} />
          </main>
          <PersonOnCaseDialog />
        </div>
      </div>
    );
  }
}

CaseDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  caseDetails: state.currentCase.details,
  searchableDataIsDirty: state.searchableDataIsDirty
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CaseDetails)
);
