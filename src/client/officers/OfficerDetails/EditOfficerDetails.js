import { editThunkWrapper } from "../thunks/officerThunkWrappers";
import React from "react";
import OfficerDetailsContainer from "./OfficerDetailsContainer";

const EditOfficerDetails = props => {
  const caseId = props.match.params.id;
  const caseOfficerId = props.match.params.caseOfficerId;

  return (
    <OfficerDetailsContainer
      caseId={caseId}
      titleAction={"Edit"}
      submitButtonText={"Save Officer"}
      submitAction={editThunkWrapper(caseId, caseOfficerId)}
      officerSearchUrl={`/cases/${caseId}/officers/${caseOfficerId}/search`}
    />
  );
};

export default EditOfficerDetails;
