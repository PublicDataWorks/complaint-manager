import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import AllegationSearchForm from "./AllegationSearchForm";
import AllegationSearchResults from "./AllegationSearchResults";

const AllegationSearch = props => {
  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <Typography variant="title" className="allegationSearchHeader">
          Search for an Allegation
        </Typography>
      </div>
      <Card
        style={{
          backgroundColor: "white",
          width: "80%",
          marginBottom: "32px"
        }}
      >
        <CardContent style={{ paddingBottom: "8px" }}>
          <Typography variant="body1" style={{ marginBottom: "16px" }}>
            Search by selecting a rule or entering at least one allegation
            keyword. For example, ‘Body Worn Camera’.
          </Typography>
          <AllegationSearchForm />
        </CardContent>
      </Card>
      <AllegationSearchResults
        caseId={props.caseId}
        caseOfficerId={props.caseOfficerId}
      />
    </div>
  );
};

export default AllegationSearch;
