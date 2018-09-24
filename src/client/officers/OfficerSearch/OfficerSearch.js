import React from "react";
import OfficerSearchForm from "./OfficerSearchForm/OfficerSearchForm";
import { Card, CardContent, Typography } from "@material-ui/core";
import OfficerSearchResults from "./OfficerSearchResults/OfficerSearchResults";
import {
  SelectUnknownOfficerButton,
  SelectUnknownOfficerLink
} from "./OfficerSearchResults/officerSearchResultsRowButtons";

const OfficerSearch = props => {
  return (
    <div>
      <div style={{ margin: "0 0 32px 0" }}>
        <Typography variant="title" className="officerSearchHeader">
          Search for an Officer
        </Typography>
        <Typography variant="body1">
          Unable to find an officer? You can{" "}
          <SelectUnknownOfficerLink
            dispatch={props.dispatch}
            initialize={props.initialize}
            path={props.path}
          />{" "}
          and identify them later.
        </Typography>
      </div>

      <Card
        style={{
          backgroundColor: "white",
          width: "60%",
          margin: "0 0 32px 0"
        }}
      >
        <CardContent style={{ paddingBottom: "8px" }}>
          <Typography variant="body1" style={{ marginBottom: "8px" }}>
            Search by entering at least one of the following fields:
          </Typography>
          <OfficerSearchForm caseId={props.caseId} />
        </CardContent>
      </Card>
      <OfficerSearchResults path={props.path} initialize={props.initialize} />
      <SelectUnknownOfficerButton
        initialize={props.initialize}
        dispatch={props.dispatch}
        path={props.path}
      />
    </div>
  );
};

export default OfficerSearch;
