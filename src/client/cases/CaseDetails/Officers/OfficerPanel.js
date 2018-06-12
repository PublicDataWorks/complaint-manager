import React from "react";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary
} from "@material-ui/core";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";
import formatDate from "../../../utilities/formatDate";
import OfficerNameDisplay from "./OfficerNameDisplay";

const OfficerPanel = ({ caseOfficer, children }) => (
  <div>
    <ExpansionPanel
      data-test="officerPanel"
      elevation={0}
      style={{ backgroundColor: "white" }}
    >
      <ExpansionPanelSummary
        style={{
          padding: "0px 24px"
        }}
      >
        <div style={{ display: "flex", width: "100%", paddingRight: 0 }}>
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
          displayLabel="Age"
          value={caseOfficer.age}
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
    </ExpansionPanel>
    <Divider />
  </div>
);

export default OfficerPanel;
