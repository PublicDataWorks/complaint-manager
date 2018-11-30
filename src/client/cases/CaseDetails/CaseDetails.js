import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NavBar from "../../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import Narrative from "./Narrative";
import Complainants from "./ComplainantWitnesses/Complainants";
import CivilianDialog from "./CivilianDialog/CivilianDialog";
import getCaseDetails from "../thunks/getCaseDetails";
import * as _ from "lodash";
import Attachments from "./Attachments/Attachments";
import styles from "./caseDetailsStyles";
import CaseDrawer from "./CaseDrawer";
import IncidentDetailsContainer from "./IncidentDetails/IncidentDetailsContainer";
import {
  closeCaseNoteDialog,
  closeCaseStatusUpdateDialog,
  closeEditDialog,
  closeRemoveCaseNoteDialog,
  closeRemovePersonDialog
} from "../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../sharedUtilities/constants";
import AccusedOfficers from "./Officers/AccusedOfficers";
import CaseNoteDialog from "./CaseNoteDialog/CaseNoteDialog";
import RemoveCivilianDialog from "../RemovePersonDialog/RemovePersonDialog";
import OldCaseStatusStepper from "./CaseStatusStepper/OldCaseStatusStepper";
import { clearOfficerPanelData } from "../../actionCreators/accusedOfficerPanelsActionCreators";
import Witnesses from "./ComplainantWitnesses/Witnesses";
import CaseStatusStepper from "./CaseStatusStepper/CaseStatusStepper";

const drawerWidthPercentage = "30%";

const appBar = {
  position: "absolute",
  marginLeft: drawerWidthPercentage,
  width: `calc(100% - ${drawerWidthPercentage})`
};

class CaseDetails extends React.Component {
  state = {
    mobileOpen: false,
    anchorEl: null,
    complainantMenuOpen: false,
    witnessMenuOpen: false
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

  componentDidMount() {
    this.props.dispatch(getCaseDetails(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.dispatch(clearOfficerPanelData());
    this.props.dispatch(closeEditDialog());
    this.props.dispatch(closeCaseNoteDialog());
    this.props.dispatch(closeCaseStatusUpdateDialog());
    this.props.dispatch(closeRemoveCaseNoteDialog());
    this.props.dispatch(closeRemovePersonDialog());
  }

  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetail) ||
      `${this.props.caseDetail.id}` !== this.props.match.params.id
    );
  }

  render() {
    if (this.caseDetailsNotYetLoaded()) {
      return null;
    }

    const statusIsClosed = this.props.caseDetail.status === CASE_STATUS.CLOSED;
    const status = this.props.featureToggles.letterGenerationFeature
      ? this.props.caseDetail.status
      : this.props.caseDetail.status === CASE_STATUS.LETTER_IN_PROGRESS
        ? CASE_STATUS.ACTIVE
        : this.props.caseDetail.status;

    const { classes } = this.props;

    return (
      <div className={classes.root} data-test="case-details-page">
        <div className={classes.appFrame}>
          <NavBar isHome={false} customStyle={appBar}>
            <Typography
              data-test="pageTitle"
              variant="title"
              color="inherit"
              style={{ marginRight: "20px" }}
            >
              {`Case #${this.props.caseDetail.caseNumber}`}
            </Typography>
            <Typography
              data-test="caseStatusBox"
              variant="caption"
              color="inherit"
              className={
                statusIsClosed ? classes.closedStatusBox : classes.statusBox
              }
            >
              {status}
            </Typography>
          </NavBar>
          <CaseDrawer classes={classes} caseDetail={this.props.caseDetail} />
          <main className={classes.content}>
            {this.props.featureToggles.letterGenerationFeature ? (
              <CaseStatusStepper />
            ) : (
              <OldCaseStatusStepper />
            )}

            <IncidentDetailsContainer />
            <Complainants
              caseDetail={this.props.caseDetail}
              dispatch={this.props.dispatch}
              handleMenuOpen={this.handleComplainantMenuOpen}
              menuOpen={this.state.complainantMenuOpen}
              handleMenuClose={this.handleComplainantMenuClose}
              anchorEl={this.state.anchorEl}
            />
            <Witnesses
              caseDetail={this.props.caseDetail}
              dispatch={this.props.dispatch}
              handleMenuOpen={this.handleWitnessMenuOpen}
              menuOpen={this.state.witnessMenuOpen}
              handleMenuClose={this.handleWitnessMenuClose}
              anchorEl={this.state.anchorEl}
            />
            <Narrative
              initialValues={{
                narrativeDetails: this.props.caseDetail.narrativeDetails,
                narrativeSummary: this.props.caseDetail.narrativeSummary
              }}
              caseId={this.props.caseDetail.id}
            />
            <AccusedOfficers
              caseId={this.props.caseDetail.id}
              incidentDate={this.props.caseDetail.incidentDate}
              accusedOfficers={this.props.caseDetail.accusedOfficers}
              dispatch={this.props.dispatch}
            />
            <Attachments />
          </main>
          <CivilianDialog />
          <RemoveCivilianDialog data-test="removeCivilianDialog" />
          <CaseNoteDialog />
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
  caseDetail: state.currentCase.details,
  featureToggles: state.featureToggles
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CaseDetails)
);
