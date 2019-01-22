import { addThunkWrapper } from "../thunks/officerThunkWrappers";
import React from "react";
import OfficerDetailsContainer from "./OfficerDetailsContainer";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import { connect } from "react-redux";

class AddOfficerDetails extends React.Component {
  render() {
    const caseId = this.props.match.params.id;

    return (
      <OfficerDetailsContainer
        caseId={caseId}
        titleAction={"Add"}
        submitButtonText={"Add Officer to Case"}
        submitAction={addThunkWrapper(caseId)}
        officerSearchUrl={`/cases/${caseId}/officers/search`}
      />
    );
  }
}

const mapDispatchToProps = {
  clearSelectedOfficer
};

export default connect(
  null,
  mapDispatchToProps
)(AddOfficerDetails);
