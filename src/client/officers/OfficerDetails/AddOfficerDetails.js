import { addThunkWrapper } from "../thunks/officerThunkWrappers";
import React from "react";
import OfficerDetailsContainer from "./OfficerDetailsContainer";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import { connect } from "react-redux";
import invalidCaseStatusRedirect from "../../cases/thunks/invalidCaseStatusRedirect";
import getCaseDetails from "../../cases/thunks/getCaseDetails";

class AddOfficerDetails extends React.Component {
  caseDetailsNotYetLoaded() {
    return (
      !this.props.caseDetails.id ||
      `${this.props.caseDetails.id}` !== this.props.match.params.id
    );
  }

  componentDidMount() {
    if (this.caseDetailsNotYetLoaded()) {
      this.props.getCaseDetails(this.props.match.params.id);
    }
  }
  componentDidUpdate() {
    if (!this.caseDetailsNotYetLoaded() && this.props.caseDetails.isArchived) {
      const caseId = this.props.caseDetails.id;
      this.props.invalidCaseStatusRedirect(caseId);
    }
  }
  render() {
    if (this.caseDetailsNotYetLoaded()) return null;
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
  clearSelectedOfficer,
  invalidCaseStatusRedirect,
  getCaseDetails
};

const mapStateToProps = state => ({
  caseDetails: state.currentCase.details
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddOfficerDetails);
