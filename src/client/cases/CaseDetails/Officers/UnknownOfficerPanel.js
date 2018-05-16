import { Divider, ExpansionPanel, ExpansionPanelSummary } from "material-ui";
import React from "react";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";

const UnknownOfficerPanel = ({ caseOfficer }) => {
  return (
    <div>
      <ExpansionPanel
        data-test="unknownOfficerPanel"
        elevation={0}
        style={{ backgroundColor: "white" }}
      >
        <ExpansionPanelSummary style={{ padding: "0px 24px" }}>
          <div style={{ display: "flex", width: "100%", paddingRight: 0 }}>
            <OfficerInfoDisplay
              displayLabel={`Officer ${
                caseOfficer.roleOnCase !== "Accused"
                  ? caseOfficer.roleOnCase
                  : ""
              }`}
              value={caseOfficer.officer.fullName}
              testLabel="officerName"
            />
          </div>
        </ExpansionPanelSummary>
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
};

export default UnknownOfficerPanel;
