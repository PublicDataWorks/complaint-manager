import React from "react";
import OfficerSearchContainer from "./OfficerSearchContainer";

const AddOfficerSearch = props => {
  const caseId = props.match.params.id;

  return (
    <OfficerSearchContainer
      caseId={caseId}
      titleAction={"Add"}
      officerDetailsPath={`/cases/${caseId}/officers/details`}
    />
  );
};

export default AddOfficerSearch;
