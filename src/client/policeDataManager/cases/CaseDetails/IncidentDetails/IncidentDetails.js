import React from "react";
import DetailsCard from "../../../shared/components/DetailsCard";
import CivilianInfoDisplay from "../PersonOnCase/CivilianInfoDisplay";
import formatDate, {
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
import {
  CONFIGS,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";

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
      pibCaseNumber: this.props.pibCaseNumber,
      priorityReason: this.props.priorityReason,
      priorityLevel: this.props.priorityLevel
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
      pibCaseNumber,
      priorityReason,
      priorityLevel,
      configs
    } = this.props;
    const intakeSourceName = intakeSource ? intakeSource.name : "";
    const howDidYouHearAboutUsSourceName = howDidYouHearAboutUsSource
      ? howDidYouHearAboutUsSource.name
      : "";
    const districtName = district ? district.name : "";
    const pbCaseNumberText = `${configs[CONFIGS.BUREAU_ACRONYM]} Case Number`;

    return (
      <DetailsCard title="Incident Details" maxWidth="850px">
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
                    displayLabel={`First Contacted ${
                      configs[CONFIGS.ORGANIZATION]
                    }`}
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
                {incidentTime ? (
                  <StyledInfoDisplay>
                    <CivilianInfoDisplay
                      displayLabel="Incident Time"
                      value={
                        this.formatTimeForDisplay(incidentDate, incidentTime) +
                        " " +
                        incidentTimezone
                      }
                      testLabel="incidentTime"
                    />
                  </StyledInfoDisplay>
                ) : (
                  <StyledInfoDisplay>
                    <CivilianInfoDisplay
                      displayLabel="Incident Time"
                      value={this.formatTimeForDisplay(
                        incidentDate,
                        incidentTime
                      )}
                      testLabel="incidentTime"
                    />
                  </StyledInfoDisplay>
                )}
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
                    displayLabel="Priority Reason"
                    value={priorityReason}
                    testLabel="incidentPriorityReason"
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
              <div className={classes.detailsRow}>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="Intake Source"
                    value={intakeSourceName}
                    testLabel="intakeSource"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="Priority Level"
                    value={priorityLevel}
                    testLabel="incidentPriorityLevel"
                  />
                </StyledInfoDisplay>
                <div
                  style={{ flex: 1, textAlign: "left", marginRight: "10px" }}
                />
              </div>
            </div>
            <div className={classes.detailsPaneButtons}>
              {this.props.isArchived ||
              !this.props.permissions?.includes(USER_PERMISSIONS.EDIT_CASE) ? (
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
      </DetailsCard>
    );
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  configs: state.configs,
  district: state.currentCase.details.caseDistrict,
  districtId: state.currentCase.details.districtId,
  firstContactDate: state.currentCase.details.firstContactDate,
  howDidYouHearAboutUsSource:
    state.currentCase.details.howDidYouHearAboutUsSource,
  howDidYouHearAboutUsSourceId:
    state.currentCase.details.howDidYouHearAboutUsSourceId,
  incidentDate: state.currentCase.details.incidentDate,
  incidentLocation: state.currentCase.details.incidentLocation,
  incidentTime: state.currentCase.details.incidentTime,
  incidentTimezone: state.currentCase.details.incidentTimezone,
  intakeSource: state.currentCase.details.intakeSource,
  intakeSourceId: state.currentCase.details.intakeSourceId,
  isArchived: state.currentCase.details.isArchived,
  open: state.ui.editIncidentDetailsDialog.open,
  permissions: state?.users?.current?.userInfo?.permissions,
  pibCaseNumber: state.currentCase.details.pibCaseNumber,
  priorityReason: state.currentCase.details.priorityReason,
  priorityLevel: state.currentCase.details.priorityLevel
});

export default connect(mapStateToProps)(IncidentDetails);
