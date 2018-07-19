import React from "react";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  Icon,
  IconButton,
  Typography
} from "@material-ui/core";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";
import formatDate from "../../../utilities/formatDate";
import OfficerNameDisplay from "./OfficerNameDisplay";
import OfficerAllegationsDisplay from "./OfficerAllegationsDisplay";
import styles from "../../../globalStyling/styles";
import { ACCUSED } from "../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import {
  accusedOfficerPanelCollapsed,
  accusedOfficerPanelExpanded
} from "../../../actionCreators/accusedOfficerPanelsActionCreators";

const OfficerPanel = ({ dispatch, caseOfficer, officerAge, children }) => (
  <div>
    <ExpansionPanel
      data-test="officerPanel"
      elevation={0}
      onChange={(event, expanded) => {
        expanded
          ? dispatch(accusedOfficerPanelExpanded(caseOfficer.id))
          : dispatch(accusedOfficerPanelCollapsed(caseOfficer.id));
      }}
      style={{ backgroundColor: "white" }}
    >
      <ExpansionPanelSummary
        style={{
          padding: "0px 24px"
        }}
      >
        <div style={{ display: "flex", width: "100%", paddingRight: 0 }}>
          <IconButton
            style={{ marginRight: 16 }}
            color="secondary"
            className="chevron-right"
          >
            <Icon>unfold_more</Icon>
          </IconButton>
          <OfficerNameDisplay
            displayLabel="Officer"
            fullName={caseOfficer.fullName}
            windowsUsername={caseOfficer.windowsUsername}
          />
          <OfficerInfoDisplay
            displayLabel="Rank/Title"
            value={caseOfficer.rank}
            testLabel="rank"
          />
          <OfficerNameDisplay
            displayLabel="Supervisor"
            fullName={caseOfficer.supervisorFullName}
            windowsUsername={caseOfficer.supervisorWindowsUsername}
          />
          {children}
        </div>
      </ExpansionPanelSummary>
      <StyledExpansionPanelDetails>
        <OfficerInfoDisplay
          displayLabel="Employee Type"
          value={caseOfficer.employeeType}
          testLabel="employeeType"
        />
        <OfficerInfoDisplay
          displayLabel="District"
          value={caseOfficer.district}
          testLabel="district"
        />
        <OfficerInfoDisplay
          displayLabel="Bureau"
          value={caseOfficer.bureau}
          testLabel="bureau"
        />
      </StyledExpansionPanelDetails>
      <StyledExpansionPanelDetails>
        <OfficerInfoDisplay
          displayLabel="Status"
          value={caseOfficer.workStatus}
          testLabel="status"
        />
        <OfficerInfoDisplay
          displayLabel="Hire Date"
          value={formatDate(caseOfficer.hireDate)}
          testLabel="hireDate"
        />
        <OfficerInfoDisplay
          displayLabel="End of Employment"
          value={formatDate(caseOfficer.endDate)}
          testLabel="endDate"
        />
      </StyledExpansionPanelDetails>
      <StyledExpansionPanelDetails>
        <OfficerInfoDisplay
          displayLabel="Race"
          value={caseOfficer.race}
          testLabel="race"
        />
        <OfficerInfoDisplay
          displayLabel="Sex"
          value={caseOfficer.sex}
          testLabel="sex"
        />
        <OfficerInfoDisplay
          displayLabel="Date of Birth (Age)"
          value={
            officerAge !== null &&
            `${formatDate(caseOfficer.dob)} (${officerAge})`
          }
          testLabel="age"
        />
      </StyledExpansionPanelDetails>
      <StyledExpansionPanelDetails>
        <OfficerInfoDisplay
          displayLabel="Notes"
          value={caseOfficer.notes}
          testLabel="notes"
        />
      </StyledExpansionPanelDetails>
      {caseOfficer &&
        caseOfficer.roleOnCase === ACCUSED && (
          <div
            style={{
              marginLeft: "64px"
            }}
          >
            <Typography
              style={{
                ...styles.section,
                margin: "8px 24px"
              }}
            >
              Allegations
            </Typography>
            {caseOfficer.allegations.length > 0 ? (
              <OfficerAllegationsDisplay
                officerId={caseOfficer.id}
                officerAllegations={caseOfficer.allegations}
              />
            ) : (
              <Typography style={{ marginLeft: "24px", fontStyle: "italic" }}>
                No allegations have been added.
              </Typography>
            )}
          </div>
        )}
    </ExpansionPanel>
    <Divider />
  </div>
);

export default connect()(OfficerPanel);
