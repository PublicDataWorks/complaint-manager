import React from "react";
import formatStringToTitleCase from "../../../utilities/formatStringToTitleCase";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";
import {ExpansionPanel, ExpansionPanelSummary, CardContent} from "@material-ui/core";

const OfficerAllegationDisplay = ({ rule, paragraph, directive, details }) => (
  <CardContent
    style={{marginBottom: '16px', paddingTop: '0px', paddingBottom: '0px'}}
  >
    <ExpansionPanel
      elevation={5}
      style={{
        width: "100%",
        background: "white",
        padding: "0",
        marginRight: "190px"
      }}
    >
      <ExpansionPanelSummary>
        <OfficerInfoDisplay
          displayLabel="Rule"
          value={formatStringToTitleCase(rule)}
          testLabel="rule"
        />
        <OfficerInfoDisplay
          displayLabel="Paragraph"
          value={formatStringToTitleCase(paragraph)}
          testLabel="paragraph"
        />
        <OfficerInfoDisplay
          displayLabel="Directive"
          value={formatStringToTitleCase(directive)}
          testLabel="directive"
        />
      </ExpansionPanelSummary>
      <StyledExpansionPanelDetails>
        <OfficerInfoDisplay
          shouldTruncate={false}
          displayLabel="Notes"
          value={details}
          testLabel="allegationDetails"
        />
      </StyledExpansionPanelDetails>
    </ExpansionPanel>
  </CardContent>
);

export default OfficerAllegationDisplay;
