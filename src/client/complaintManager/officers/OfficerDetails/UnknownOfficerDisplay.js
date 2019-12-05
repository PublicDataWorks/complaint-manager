import React from "react";
import { Typography } from "@material-ui/core";

import { ChangeOfficer } from "../OfficerSearch/OfficerSearchResults/officerSearchResultsRowButtons";

const UnknownOfficerDisplay = ({ caseId, dispatch, officerSearchUrl }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "start"
    }}
  >
    <Typography
      data-test="unknownOfficerMessage"
      style={{ marginBottom: "32px" }}
      variant="body2"
    >
      You have selected Unknown Officer. Change this officer to a known officer
      by selecting Search for Officer.
    </Typography>
    <ChangeOfficer
      caseId={caseId}
      dispatch={dispatch}
      officerSearchUrl={officerSearchUrl}
    >
      Search For Officer
    </ChangeOfficer>
  </div>
);

export default UnknownOfficerDisplay;
