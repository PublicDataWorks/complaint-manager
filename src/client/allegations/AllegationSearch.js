import React from "react";
import { Card, CardContent, Typography } from "material-ui";
import AllegationSearchForm from "./AllegationSearchForm";
import AllegationSearchResults from "./AllegationSearchResults";

const AllegationSearch = props => {
  return (
    <div>
      <div style={{ margin: "0 0 32px 0" }}>
        <Typography variant="title">Search for an Allegation</Typography>
        <Typography variant="body1">
          Search by selecting a rule or entering at least one allegation
          keyword. For example, ‘Body Worn Camera’.
        </Typography>
      </div>
      <Card
        style={{
          backgroundColor: "white",
          width: "100%",
          margin: "0 0 32px 0"
        }}
      >
        <CardContent style={{ paddingBottom: "8px" }}>
          <AllegationSearchForm />
        </CardContent>
      </Card>
      <AllegationSearchResults />
    </div>
  );
};

export default AllegationSearch;
