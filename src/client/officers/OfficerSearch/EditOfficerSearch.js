import React from "react";
import OfficerSearchContainer from "./OfficerSearchContainer";

const EditOfficerSearch = props => {
  const caseId = props.match.params.id;
  const caseOfficerId = props.match.params.caseOfficerId;

  return (
    <OfficerSearchContainer
      caseId={caseId}
      titleAction={"Edit"}
      officerDetailsPath={`/cases/${caseId}/officers/${caseOfficerId}`}
    />
  );
};

export default EditOfficerSearch;
