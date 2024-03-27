import React from "react";
import { useSelector, useDispatch } from "react-redux";
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

const selectCaseDetails = state => state.currentCase.details;
const selectConfigs = state => state.configs;
const selectPermissions = state => state.users?.current?.userInfo?.permissions;
const selectOpenDialog = state => state.ui.editIncidentDetailsDialog.open;

const IncidentDetails = () => {
  const dispatch = useDispatch();
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
    pibCaseNumber,
    priorityReason,
    priorityLevel,
    classes
  } = useSelector(selectCaseDetails);

  const configs = useSelector(selectConfigs);
  const intakeSourceName = intakeSource?.name || "";
  const howDidYouHearAboutUsSourceName = howDidYouHearAboutUsSource?.name || "";
  const districtName = district?.name || "";
  const pbCaseNumberText = `${configs[CONFIGS.BUREAU_ACRONYM]} Case Number`;
  const priorityReasonName = priorityReason?.name || "";
  const priorityLevelName = priorityLevel?.name || "";
  const isArchived = useSelector(selectCaseDetails).isArchived;
  const permissions = useSelector(selectPermissions);
  const openDialog = useSelector(selectOpenDialog);

  // Helper function to format time for display
  const formatTimeForDisplay = (date, time) =>
    !time ? time : format12HourTime(time);

  const handleDialogOpen = () => {
    const formValues = {
      firstContactDate,
      incidentDate,
      incidentTime,
      incidentTimezone,
      incidentLocation,
      districtId: district?.id,
      intakeSourceId: intakeSource?.id,
      howDidYouHearAboutUsSourceId: howDidYouHearAboutUsSource?.id,
      pibCaseNumber,
      priorityReason,
      priorityLevel
    };

    dispatch(initialize("IncidentDetails", formValues));
    dispatch(openEditIncidentDetailsDialog());
  };

  const handleDialogClose = () => {
    dispatch(reset("IncidentDetails"));
    dispatch(closeEditIncidentDetailsDialog());
  };

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
            <div>
              <StyledInfoDisplay>
                <CivilianInfoDisplay
                  displayLabel={`First Contacted ${configs[CONFIGS.ORGANIZATION]
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
                      formatTimeForDisplay(incidentDate, incidentTime) +
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
                    value={formatTimeForDisplay(incidentDate, incidentTime)}
                    testLabel="incidentTime"
                  />
                </StyledInfoDisplay>
              )}
            </div>
            <div>
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
                  value={priorityReasonName}
                  testLabel="incidentPriorityReasons"
                />
              </StyledInfoDisplay>
            </div>
            <div>
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
            <div>
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
                  value={priorityLevelName}
                  testLabel="incidentPriorityLevel"
                />
              </StyledInfoDisplay>
              <div
                style={{ flex: 1, textAlign: "left", marginRight: "10px" }}
              />
            </div>
          </div>
          <div>
            {isArchived ||
              !permissions?.includes(USER_PERMISSIONS.EDIT_CASE) ? (
              <div />
            ) : (
              <LinkButton
                data-testid="editIncidentDetailsButton"
                onClick={handleDialogOpen}
              >
                Edit
              </LinkButton>
            )}
          </div>
        </div>
      </CardContent>
      <IncidentDetailsDialog
        intakeSourceName={intakeSourceName}
        dialogOpen={openDialog}
        handleDialogClose={handleDialogClose}
        caseId={caseId}
      />
    </DetailsCard>
  );
};

export default IncidentDetails;
