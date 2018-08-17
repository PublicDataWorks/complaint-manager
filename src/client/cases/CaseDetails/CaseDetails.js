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
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { Menu, MenuItem } from "@material-ui/core";
import IncidentDetailsContainer from "./IncidentDetails/IncidentDetailsContainer";
import {
  closeCaseNoteDialog,
  closeCaseStatusUpdateDialog,
  closeEditDialog,
  closeRemoveCaseNoteDialog,
  closeRemovePersonDialog,
  openCaseNoteDialog,
  openCivilianDialog
} from "../../actionCreators/casesActionCreators";
import createCivilian from "../thunks/createCivilian";
import {
  CASE_STATUS,
  CIVILIAN_FORM_NAME,
  COMPLAINANT,
  TIMEZONE
} from "../../../sharedUtilities/constants";
import { initialize } from "redux-form";
import { push } from "react-router-redux";
import AccusedOfficers from "./Officers/AccusedOfficers";
import CaseNoteDialog from "./CaseNoteDialog/CaseNoteDialog";
import timezone from "moment-timezone";
import RemoveCivilianDialog from "../RemovePersonDialog/RemovePersonDialog";
import CaseStatusStepper from "./CaseStatusStepper/CaseStatusStepper";
import { clearOfficerPanelData } from "../../actionCreators/accusedOfficerPanelsActionCreators";
import Witnesses from "./ComplainantWitnesses/Witnesses";

const drawerWidthPercentage = "30%";

const appBar = {
  position: "absolute",
  marginLeft: drawerWidthPercentage,
  width: `calc(100% - ${drawerWidthPercentage})`
};

class CaseDetails extends React.Component {
  state = {
    mobileOpen: false,
    menuOpen: false,
    anchorEl: null,
    complainantMenuOpen: false,
    witnessMenuOpen: false
  };

  handleMenuOpen = event => {
    this.setState({ menuOpen: true, anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuOpen: false });
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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <NavBar isHome={false} customStyle={appBar}>
            <Typography
              data-test="pageTitle"
              variant="title"
              color="inherit"
              style={{ marginRight: "20px" }}
            >
              {`Case #${this.props.caseDetail.id}`}
            </Typography>
            <Typography
              data-test="caseStatusBox"
              variant="caption"
              color="inherit"
              className={
                statusIsClosed ? classes.closedStatusBox : classes.statusBox
              }
            >
              {this.props.caseDetail.status}
            </Typography>
          </NavBar>
          <CaseDrawer classes={classes} caseDetail={this.props.caseDetail} />
          <main className={classes.content}>
            <CaseStatusStepper />
            <IncidentDetailsContainer />
            <Complainants
              caseDetail={this.props.caseDetail}
              dispatch={this.props.dispatch}
              handleMenuOpen={this.handleComplainantMenuOpen}
              updateAddComplainantWitnessesToggle={
                this.props.featureToggles.updateAddComplainantsWitnesses
              }
              menuOpen={this.state.complainantMenuOpen}
              handleMenuClose={this.handleComplainantMenuClose}
              anchorEl={this.state.anchorEl}
            />
            <Witnesses
              caseDetail={this.props.caseDetail}
              dispatch={this.props.dispatch}
              handleMenuOpen={this.handleWitnessMenuOpen}
              updateAddComplainantWitnessesToggle={
                this.props.featureToggles.updateAddComplainantsWitnesses
              }
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
              accusedOfficers={this.props.caseDetail.accusedOfficers}
              incidentDate={this.props.caseDetail.incidentDate}
            />
            <Attachments />
          </main>
          <CivilianDialog />
          <RemoveCivilianDialog data-test="removeCivilianDialog" />
          <Button
            data-test="caseActionMenu"
            variant="fab"
            color="primary"
            style={{ position: "fixed", bottom: "32px", right: "32px" }}
            onClick={this.handleMenuOpen}
          >
            <AddIcon />
          </Button>
          <Menu
            open={this.state.menuOpen}
            onClose={this.handleMenuClose}
            anchorEl={this.state.anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "center",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
          >
            {!this.props.featureToggles.updateAddComplainantsWitnesses ? (
              <MenuItem
                data-test="addCivilianButton"
                onClick={() => {
                  this.handleMenuClose();
                  this.props.dispatch(
                    initialize(CIVILIAN_FORM_NAME, {
                      roleOnCase: COMPLAINANT,
                      caseId: this.props.caseDetail.id
                    })
                  );
                  this.props.dispatch(
                    openCivilianDialog("Add Civilian", "Create", createCivilian)
                  );
                }}
              >
                Add Civilian
              </MenuItem>
            ) : null}
            <MenuItem
              data-test="addOfficerButton"
              onClick={() => {
                this.props.dispatch(
                  push(`/cases/${this.props.caseDetail.id}/officers/search`)
                );
              }}
            >
              Add Officer
            </MenuItem>
            <MenuItem
              data-test="logCaseNoteButton"
              onClick={() => {
                this.props.dispatch(
                  initialize("CaseNotes", {
                    actionTakenAt: timezone
                      .tz(new Date(Date.now()), TIMEZONE)
                      .format("YYYY-MM-DDTHH:mm")
                  })
                );
                this.props.dispatch(openCaseNoteDialog("Add", {}));
                this.handleMenuClose();
              }}
            >
              Add Case Note
            </MenuItem>
          </Menu>
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
  featureToggles: state.featureToggles,
  caseDetail: state.currentCase.details
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CaseDetails)
);
