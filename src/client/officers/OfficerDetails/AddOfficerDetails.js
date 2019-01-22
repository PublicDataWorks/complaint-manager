import { addThunkWrapper } from "../thunks/officerThunkWrappers";
import React from "react";
import OfficerDetailsContainer from "./OfficerDetailsContainer";

const AddOfficerDetails = props => {
  const caseId = props.match.params.id;

  return (
    <OfficerDetailsContainer
      caseId={caseId}
      titleAction={"Add"}
      submitButtonText={"Add Officer to Case"}
      submitAction={addThunkWrapper(caseId)}
      officerSearchUrl={`/cases/${caseId}/officers/search`}
    />
  );
};

export default AddOfficerDetails;
