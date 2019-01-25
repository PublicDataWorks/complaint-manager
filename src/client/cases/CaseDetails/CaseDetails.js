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
import IncidentDetails from "./IncidentDetails/IncidentDetails";
import {
  closeCaseNoteDialog,
  closeCaseStatusUpdateDialog,
  closeEditCivilianDialog,
  closeEditIncidentDetailsDialog,
  closeRemoveCaseNoteDialog,
  closeRemovePersonDialog
} from "../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../sharedUtilities/constants";
import AccusedOfficers from "./Officers/AccusedOfficers";
import CaseNoteDialog from "./CaseNoteDialog/CaseNoteDialog";
import RemoveCivilianDialog from "../RemovePersonDialog/RemovePersonDialog";
import { clearOfficerPanelData } from "../../actionCreators/accusedOfficerPanelsActionCreators";
import Witnesses from "./ComplainantWitnesses/Witnesses";
import CaseStatusStepper from "./CaseStatusStepper/CaseStatusStepper";
import EditLetterStatusMessage, {
  PAGE_TYPE
} from "./EditLetterStatusMessage/EditLetterStatusMessage";
import getLetterType from "../ReferralLetter/thunks/getLetterType";

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
    const caseId = this.props.match.params.id;
    this.props.dispatch(getCaseDetails(caseId));
    this.props.dispatch(getLetterType(caseId));
  }

  componentWillUnmount() {
    this.props.dispatch(clearOfficerPanelData());
    this.props.dispatch(closeEditCivilianDialog());
    this.props.dispatch(closeCaseNoteDialog());
    this.props.dispatch(closeCaseStatusUpdateDialog());
    this.props.dispatch(closeRemoveCaseNoteDialog());
    this.props.dispatch(closeRemovePersonDialog());
    this.props.dispatch(closeEditIncidentDetailsDialog());
  }

  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetails) ||
      `${this.props.caseDetails.id}` !== this.props.match.params.id
    );
  }

  render() {
    if (this.caseDetailsNotYetLoaded()) {
      return null;
    }

    const statusIsClosed = this.props.caseDetails.status === CASE_STATUS.CLOSED;
    const status = this.props.caseDetails.status;

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
              {`Case #${this.props.caseDetails.caseReference}`}
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
          <CaseDrawer classes={classes} caseDetails={this.props.caseDetails} />
          <main className={classes.content}>
            <CaseStatusStepper />
            <div style={{ marginLeft: "5%", marginRight: "5%" }}>
              <EditLetterStatusMessage pageType={PAGE_TYPE.CASE_DETAILS} />
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
            <AccusedOfficers
              caseId={this.props.caseDetails.id}
              incidentDate={this.props.caseDetails.incidentDate}
              accusedOfficers={this.props.caseDetails.accusedOfficers}
              dispatch={this.props.dispatch}
              isArchived={this.props.caseDetails.isArchived}
            />
            <Attachments isArchived={this.props.caseDetails.isArchived} />
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
  caseDetails: state.currentCase.details,
  letterType: state.referralLetter.letterType
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CaseDetails)
);
