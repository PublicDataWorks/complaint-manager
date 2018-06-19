import React, { Fragment } from "react";
import formatStringToTitleCase from "../../../utilities/formatStringToTitleCase";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";

const OfficerAllegationDisplay = ({ rule, paragraph, directive, details }) => (
  <Fragment>
    <StyledExpansionPanelDetails>
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
    </StyledExpansionPanelDetails>
    <StyledExpansionPanelDetails>
      <OfficerInfoDisplay
        displayLabel="Notes"
        value={details}
        testLabel="allegationDetails"
      />
    </StyledExpansionPanelDetails>
  </Fragment>
);

export default OfficerAllegationDisplay;
