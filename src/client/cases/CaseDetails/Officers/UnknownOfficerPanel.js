import { Typography, Divider, ExpansionPanel, ExpansionPanelSummary } from "@material-ui/core";
import React, {Fragment} from "react";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";
import {ACCUSED} from "../../../../sharedUtilities/constants";
import styles from "../../../globalStyling/styles";
import OfficerAllegationsDisplay from "./OfficerAllegationsDisplay";

const UnknownOfficerPanel = ({ caseOfficer, children }) => {
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
              displayLabel="Officer"
              value={caseOfficer.fullName}
              testLabel="officerName"
            />
            {children}
          </div>
        </ExpansionPanelSummary>
        <StyledExpansionPanelDetails>
          <OfficerInfoDisplay
            displayLabel="Notes"
            value={caseOfficer.notes}
            testLabel="notes"
          />
        </StyledExpansionPanelDetails>
        {caseOfficer &&
        caseOfficer.roleOnCase === ACCUSED && (
          <Fragment>
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
                officerAllegations={caseOfficer.allegations}
              />
            ) : (
              <Typography style={{ marginLeft: "24px", fontStyle: "italic" }}>
                No allegations have been added.
              </Typography>
            )}
          </Fragment>
        )}
      </ExpansionPanel>
      <Divider />
    </div>
  );
};

export default UnknownOfficerPanel;
