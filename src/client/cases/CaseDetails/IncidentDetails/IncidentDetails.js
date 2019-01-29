import React from "react";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import CivilianInfoDisplay from "../ComplainantWitnesses/CivilianInfoDisplay";
import formatDate, {
  computeTimeZone,
  format12HourTime
} from "../../../utilities/formatDate";
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

class IncidentDetails extends React.Component {
  formatTimeForDisplay = (date, time) => {
    if (!time) return time;
    return format12HourTime(time) + " " + computeTimeZone(date, time);
  };

  handleDialogOpen = () => {
    const formValues = {
      firstContactDate: this.props.firstContactDate,
      incidentDate: this.props.incidentDate,
      incidentTime: this.props.incidentTime,
      incidentLocation: this.props.incidentLocation,
      district: this.props.district,
      classificationId: this.props.classificationId,
      intakeSourceId: this.props.intakeSourceId
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
      caseId,
      incidentLocation,
      district,
      classification,
      intakeSource,
      classes,
      pibCaseNumber,
      featureToggles
    } = this.props;
    const classificationInitialism = classification
      ? classification.initialism
      : "";
    const intakeSourceName = intakeSource ? intakeSource.name : "";

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
                    displayLabel="First Contacted IPM"
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
                    )}
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
                    value={district}
                    testLabel="incidentDistrict"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="Classification"
                    value={classificationInitialism}
                    testLabel="classification"
                  />
                </StyledInfoDisplay>
              </div>
              <div className={classes.detailsRow}>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="Intake Source"
                    value={intakeSourceName}
                    testLabel="intakeSource"
                  />
                </StyledInfoDisplay>
              </div>
              <div className={classes.detailsLastRow}>
                {!featureToggles.pibCaseNumberFeature ? null : (
                  <StyledInfoDisplay>
                    <CivilianInfoDisplay
                      displayLabel="PIB Case Number"
                      value={pibCaseNumber}
                      testLabel="pibCaseNumber"
                    />
                  </StyledInfoDisplay>
                )}
              </div>
            </div>
            <div className={classes.detailsPaneButtons}>
              {this.props.isArchived ? (
                <div />
              ) : (
                <LinkButton
                  data-test="editIncidentDetailsButton"
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
  incidentLocation: state.currentCase.details.incidentLocation,
  district: state.currentCase.details.district,
  caseId: state.currentCase.details.id,
  classificationId: state.currentCase.details.classificationId,
  classification: state.currentCase.details.classification,
  intakeSourceId: state.currentCase.details.intakeSourceId,
  intakeSource: state.currentCase.details.intakeSource,
  isArchived: state.currentCase.details.isArchived,
  open: state.ui.editIncidentDetailsDialog.open,
  featureToggles: state.featureToggles,
  pibCaseNumber: state.currentCase.details.pibCaseNumber
});

export default connect(mapStateToProps)(IncidentDetails);
