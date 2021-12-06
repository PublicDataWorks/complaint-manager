import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NavBar from "../../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import Narrative from "./Narrative";
import Complainants from "./ComplainantWitnesses/Complainants";
import getCaseDetails from "../thunks/getCaseDetails";
import * as _ from "lodash";
import Attachments from "./Attachments/Attachments";
import styles from "./caseDetailsStyles";
import CaseDrawer from "./CaseDrawer";
import IncidentDetails from "./IncidentDetails/IncidentDetails";
import {
  closeArchiveCaseDialog,
  closeCaseNoteDialog,
  closeCaseTagDialog,
  closeCaseStatusUpdateDialog,
  closeEditCivilianDialog,
  closeEditIncidentDetailsDialog,
  closeRemoveAttachmentConfirmationDialog,
  closeRemoveCaseNoteDialog,
  closeRemoveCaseTagDialog,
  closeRemovePersonDialog,
  closeRestoreArchivedCaseDialog
} from "../../actionCreators/casesActionCreators";
import {
  CASE_STATUS,
  NARRATIVE_FORM
} from "../../../../sharedUtilities/constants";
import Accused from "./Officers/Accused";
import { clearOfficerPanelData } from "../../actionCreators/accusedOfficerPanelsActionCreators";
import Witnesses from "./ComplainantWitnesses/Witnesses";
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

const CaseNoteDialog = lazy(() => import("./CaseNoteDialog/CaseNoteDialog"));
const RemoveCivilianDialog = lazy(() =>
  import("../RemovePersonDialog/RemovePersonDialog")
);
const CivilianDialog = lazy(() => import("./CivilianDialog/CivilianDialog"));
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
  dispatch(closeRemovePersonDialog());
  dispatch(closeEditIncidentDetailsDialog());
  dispatch(closeRestoreArchivedCaseDialog());
  dispatch(closeArchiveCaseDialog());
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
    mobileOpen: false,
    anchorEl: null,
    complainantMenuOpen: false,
    witnessMenuOpen: false,
    addAccusedMenuOpen: false
  };

  handleComplainantMenuOpen = event => {
    this.setState({ complainantMenuOpen: true, anchorEl: event.currentTarget });
  };

  handleComplainantMenuClose = () => {
    this.setState({ complainantMenuOpen: false });
  };

  handleWitnessMenuOpen = event => {
    this.setState({ witnessMenuOpen: true, anchorEl: event.currentTarget });
  };

  handleWitnessMenuClose = () => {
    this.setState({ witnessMenuOpen: false });
  };

  handleAddAccusedMenuOpen = event => {
    this.setState({ addAccusedMenuOpen: true, anchorEl: event.currentTarget });
  };

  handleAddAccusedMenuClose = () => {
    this.setState({ addAccusedMenuOpen: false });
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
  }

  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetails) ||
      `${this.props.caseDetails.id}` !== this.props.match.params.id
    );
  }

  navigateCaseToCase() {
    const caseId = this.props.match.params.id;
    if (`${this.props.caseDetails.id}` !== caseId) {
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
              handleMenuOpen={this.handleComplainantMenuOpen}
              menuOpen={this.state.complainantMenuOpen}
              handleMenuClose={this.handleComplainantMenuClose}
              anchorEl={this.state.anchorEl}
              classes={classes}
            />
            <Witnesses
              caseDetails={this.props.caseDetails}
              dispatch={this.props.dispatch}
              handleMenuOpen={this.handleWitnessMenuOpen}
              menuOpen={this.state.witnessMenuOpen}
              handleMenuClose={this.handleWitnessMenuClose}
              anchorEl={this.state.anchorEl}
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
            <Accused
              caseId={this.props.caseDetails.id}
              incidentDate={this.props.caseDetails.incidentDate}
              accusedOfficers={this.props.caseDetails.accusedOfficers}
              dispatch={this.props.dispatch}
              isArchived={this.props.caseDetails.isArchived}
              handleMenuOpen={this.handleAddAccusedMenuOpen}
              menuOpen={this.state.addAccusedMenuOpen}
              handleMenuClose={this.handleAddAccusedMenuClose}
              anchorEl={this.state.anchorEl}
            />
            <Attachments isArchived={this.props.caseDetails.isArchived} />
          </main>
          <Suspense
            fallback={() => (
              <CircularProgress data-testid="spinner" size={30} />
            )}
          >
            <CivilianDialog />
            <RemoveCivilianDialog data-testid="removeCivilianDialog" />
            <CaseNoteDialog />
          </Suspense>
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
  caseDetails: state.currentCase.details
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CaseDetails)
);
