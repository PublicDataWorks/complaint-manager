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
      priorityLevel: this.props.priorityLevel,
      facilityId: this.props.policeIncidentDetails
        ? undefined
        : this.props.facilityId,
      facilities: this.props.policeIncidentDetails
        ? undefined
        : this.props.facilities,
      housingUnitId: this.props.policeIncidentDetails
        ? undefined
        : this.props.housingUnitId,
      housingUnits: this.props.policeIncidentDetails
        ? undefined
        : this.props.housingUnits,
      nopdCaseNumber: this.props.nopdCaseNumber
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
      policeIncidentDetails,
      priorityIncidentsFlag,
      priorityReason,
      priorityLevel,
      facilityId,
      facilities,
      housingUnitId,
      nopdCaseNumber,
      configs
    } = this.props;
    const intakeSourceName = intakeSource ? intakeSource.name : "";
    const howDidYouHearAboutUsSourceName = howDidYouHearAboutUsSource
      ? howDidYouHearAboutUsSource.name
      : "";
    const districtName = district ? district.name : "";
    const facilityName = facilities.find(f => f.id === facilityId)?.name;
    const pbCaseNumberText = `${configs[CONFIGS.BUREAU_ACRONYM]} Case Number`;
    const housingUnitName = facilities
      ?.find(facility => facility.id === facilityId)
      ?.housingUnits?.find(h => h.id === housingUnitId)?.name;

    const FirstContacted = (
      <StyledInfoDisplay>
        <CivilianInfoDisplay
          displayLabel={`First Contacted ${configs[CONFIGS.ORGANIZATION]}`}
          value={formatDate(firstContactDate)}
          testLabel="firstContactDate"
        />
      </StyledInfoDisplay>
    );

    const IncidentDate = (
      <StyledInfoDisplay>
        <CivilianInfoDisplay
          displayLabel="Incident Date"
          value={formatDate(incidentDate)}
          testLabel="incidentDate"
        />
      </StyledInfoDisplay>
    );

    const IncidentTime = incidentTime ? (
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
          value={this.formatTimeForDisplay(incidentDate, incidentTime)}
          testLabel="incidentTime"
        />
      </StyledInfoDisplay>
    );

    const Facility = (
      <StyledInfoDisplay>
        <CivilianInfoDisplay
          displayLabel="Facility"
          value={facilityName}
          testLabel="facilityId"
        />
      </StyledInfoDisplay>
    );

    const HousingUnit = (
      <StyledInfoDisplay>
        <CivilianInfoDisplay
          displayLabel="Housing Unit"
          value={housingUnitName}
          testLabel="housingUnitId"
        />
      </StyledInfoDisplay>
    );

    const IncidentLocation = (
      <StyledInfoDisplay gridColumn={1}>
        <AddressInfoDisplay
          testLabel="incidentLocation"
          displayLabel="Incident Location"
          address={incidentLocation}
          useLineBreaks={true}
        />
      </StyledInfoDisplay>
    );

    const District = (
      <StyledInfoDisplay gridColumn={2}>
        <CivilianInfoDisplay
          displayLabel="District/Assignment"
          value={districtName}
          testLabel="incidentDistrict"
        />
      </StyledInfoDisplay>
    );

    const PriorityReason = priorityIncidentsFlag && priorityReason && (
      <StyledInfoDisplay gridColumn={3}>
        <CivilianInfoDisplay
          displayLabel="Priority Reason"
          value={priorityReason.name}
          testLabel="incidentPriorityReasons"
        />
      </StyledInfoDisplay>
    );

    const HowDidYouHearAboutUs = (
      <StyledInfoDisplay>
        <CivilianInfoDisplay
          displayLabel="How did you hear about us?"
          value={howDidYouHearAboutUsSourceName}
          testLabel="howDidYouHearAboutUsSource"
        />
      </StyledInfoDisplay>
    );

    const PbCaseNumber = (
      <StyledInfoDisplay>
        <CivilianInfoDisplay
          displayLabel={pbCaseNumberText}
          value={pibCaseNumber}
          testLabel="pibCaseNumber"
        />
      </StyledInfoDisplay>
    );

    const IntakeSource = (
      <StyledInfoDisplay>
        <CivilianInfoDisplay
          displayLabel="Intake Source"
          value={intakeSourceName}
          testLabel="intakeSource"
        />
      </StyledInfoDisplay>
    );

    const PriorityLevel = priorityIncidentsFlag && priorityLevel && (
      <StyledInfoDisplay>
        <CivilianInfoDisplay
          displayLabel="Priority Level"
          value={priorityLevel.name}
          testLabel="incidentPriorityLevel"
        />
      </StyledInfoDisplay>
    );

    const NopdCaseNumber = (
      <StyledInfoDisplay>
        <CivilianInfoDisplay
          displayLabel="NOPD Case Number"
          value={nopdCaseNumber}
          testLabel="nopdCaseNumber"
        />
      </StyledInfoDisplay>
    );

    const detailsRows = policeIncidentDetails
      ? [
          [FirstContacted, IncidentDate, IncidentTime],
          [IncidentLocation, District, PriorityReason],
          [HowDidYouHearAboutUs, PbCaseNumber, PriorityLevel],
          [
            IntakeSource,
            NopdCaseNumber,
            <div style={{ flex: 1, textAlign: "left", marginRight: "10px" }} />
          ]
        ]
      : [
          [FirstContacted, IncidentDate, IncidentTime],
          [IntakeSource, Facility, HousingUnit],
          [
            PriorityLevel,
            PriorityReason,
            <div style={{ flex: 1, textAlign: "left", marginRight: "10px" }} />
          ]
        ];

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
              {detailsRows.map((row, index) => (
                <div
                  key={index}
                  className={classes.detailsRow}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr"
                  }}
                >
                  {row}
                </div>
              ))}
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
          intakeSourceName={intakeSourceName}
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
  facilities: state.facilities,
  facilityId: state.currentCase.details.facilityId,
  firstContactDate: state.currentCase.details.firstContactDate,
  housingUnitId: state.currentCase.details.housingUnitId,
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
  nopdCaseNumber: state.currentCase.details.nopdCaseNumber,
  open: state.ui.editIncidentDetailsDialog.open,
  permissions: state?.users?.current?.userInfo?.permissions,
  pibCaseNumber: state.currentCase.details.pibCaseNumber,
  policeIncidentDetails: state.featureToggles.policeIncidentDetails,
  priorityIncidentsFlag: state.featureToggles.priorityIncidents,
  priorityLevel: state.currentCase.details.priorityLevel,
  priorityReason: state.currentCase.details.priorityReason
});

export default connect(mapStateToProps)(IncidentDetails);
