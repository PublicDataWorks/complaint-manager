import React from "react";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import CivilianInfoDisplay from "../ComplainantWitnesses/CivilianInfoDisplay";
import formatDate, {
  computeTimeZone,
  format12HourTime
} from "../../../../../sharedUtilities/formatDate";
import LinkButton from "../../../shared/components/LinkButton";
import IncidentDetailsDialog from "./IncidentDetailsDialog";
import AddressInfoDisplay from "../../../shared/components/AddressInfoDisplay";
import { initialize, reset } from "redux-form";
import { CardContent } from "@material-ui/core";
import { connect } from "react-redux";
import {
  closeEditIncidentDetailsDialog,
  openEditIncidentDetailsDialog
} from "../../../actionCreators/casesActionCreators";
import StyledInfoDisplay from "../../../shared/components/StyledInfoDisplay";

const {
  FIRST_CONTACTED_ORGANIZATION,
  BUREAU_ACRONYM
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
class IncidentDetails extends React.Component {
  formatTimeForDisplay = (date, time) => {
    if (!time) return time;
    return format12HourTime(time);
  };
  
  handleDialogOpen = () => {
    const formValues = {
      firstContactDate: this.props.firstContactDate,
      incidentDate: this.props.incidentDate,
      incidentTime: this.props.incidentTime,
      incidentTimezone: this.props.incidentTimezone,
      incidentLocation: this.props.incidentLocation,
      districtId: this.props.districtId,
      intakeSourceId: this.props.intakeSourceId,
      howDidYouHearAboutUsSourceId: this.props.howDidYouHearAboutUsSourceId,
      pibCaseNumber: this.props.pibCaseNumber
    };

    this.props.dispatch(initialize("IncidentDetails", formValues));
    this.props.dispatch(openEditIncidentDetailsDialog());
  };

  handleDialogClose = () => {
    this.props.dispatch(reset("IncidentDetails"));
    this.props.dispatch(closeEditIncidentDetailsDialog());
  };

  render() {
    const {
      firstContactDate,
      incidentDate,
      incidentTime,
      incidentTimezone,
      caseId,
      incidentLocation,
      district,
      intakeSource,
      howDidYouHearAboutUsSource,
      classes,
      pibCaseNumber
    } = this.props;
    console.log(this.props);
    const intakeSourceName = intakeSource ? intakeSource.name : "";
    const howDidYouHearAboutUsSourceName = howDidYouHearAboutUsSource
      ? howDidYouHearAboutUsSource.name
      : "";
    const districtName = district ? district.name : "";
    const pbCaseNumberText = `${BUREAU_ACRONYM} Case Number`;

    return (
      <BaseCaseDetailsCard title="Incident Details">
        <CardContent style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              paddingRight: 0
            }}
          >
            <div style={{ width: "100%" }}>
              <div className={classes.detailsRow}>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel={FIRST_CONTACTED_ORGANIZATION}
                    value={formatDate(firstContactDate)}
                    testLabel="firstContactDate"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="Incident Date"
                    value={formatDate(incidentDate)}
                    testLabel="incidentDate"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="Incident Time"
                    value={this.formatTimeForDisplay(
                      incidentDate,
                      incidentTime
                    ) + " " + incidentTimezone}
                    testLabel="incidentTime"
                  />
                </StyledInfoDisplay>
              </div>
              <div className={classes.detailsRow}>
                <StyledInfoDisplay>
                  <AddressInfoDisplay
                    testLabel="incidentLocation"
                    displayLabel="Incident Location"
                    address={incidentLocation}
                    useLineBreaks={true}
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="District"
                    value={districtName}
                    testLabel="incidentDistrict"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="Intake Source"
                    value={intakeSourceName}
                    testLabel="intakeSource"
                  />
                </StyledInfoDisplay>
              </div>
              <div className={classes.detailsRow}>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="How did you hear about us?"
                    value={howDidYouHearAboutUsSourceName}
                    testLabel="howDidYouHearAboutUsSource"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel={pbCaseNumberText}
                    value={pibCaseNumber}
                    testLabel="pibCaseNumber"
                  />
                </StyledInfoDisplay>
                <div
                  style={{ flex: 1, textAlign: "left", marginRight: "10px" }}
                />
              </div>
            </div>
            <div className={classes.detailsPaneButtons}>
              {this.props.isArchived ? (
                <div />
              ) : (
                <LinkButton
                  data-testid="editIncidentDetailsButton"
                  onClick={this.handleDialogOpen}
                >
                  Edit
                </LinkButton>
              )}
            </div>
          </div>
        </CardContent>
        <IncidentDetailsDialog
          dialogOpen={this.props.open}
          handleDialogClose={this.handleDialogClose}
          caseId={caseId}
        />
      </BaseCaseDetailsCard>
    );
  }
}

const mapStateToProps = state => ({
  firstContactDate: state.currentCase.details.firstContactDate,
  incidentDate: state.currentCase.details.incidentDate,
  incidentTime: state.currentCase.details.incidentTime,
  incidentTimezone: state.currentCase.details.incidentTimezone,
  incidentLocation: state.currentCase.details.incidentLocation,
  districtId: state.currentCase.details.districtId,
  district: state.currentCase.details.caseDistrict,
  caseId: state.currentCase.details.id,
  intakeSourceId: state.currentCase.details.intakeSourceId,
  intakeSource: state.currentCase.details.intakeSource,
  howDidYouHearAboutUsSourceId:
    state.currentCase.details.howDidYouHearAboutUsSourceId,
  howDidYouHearAboutUsSource:
    state.currentCase.details.howDidYouHearAboutUsSource,
  isArchived: state.currentCase.details.isArchived,
  open: state.ui.editIncidentDetailsDialog.open,
  pibCaseNumber: state.currentCase.details.pibCaseNumber
});

export default connect(mapStateToProps)(IncidentDetails);
