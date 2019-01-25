import { editThunkWrapper } from "../thunks/officerThunkWrappers";
import React from "react";
import OfficerDetailsContainer from "./OfficerDetailsContainer";
import { connect } from "react-redux";
import invalidCaseStatusRedirect from "../../cases/thunks/invalidCaseStatusRedirect";
import getCaseDetails from "../../cases/thunks/getCaseDetails";

class EditOfficerDetails extends React.Component {
  caseDetailsNotYetLoaded = () => {
    return (
      !this.props.caseDetails ||
      `${this.props.caseDetails.id}` !== this.props.match.params.id
    );
  };

  componentDidMount() {
    if (this.caseDetailsNotYetLoaded()) {
      this.props.getCaseDetails(this.props.match.params.id);
    }
  }

  componentDidUpdate() {
    if (!this.caseDetailsNotYetLoaded() && this.props.caseDetails.isArchived) {
      this.props.invalidCaseStatusRedirect(this.props.caseDetails.id);
    }
  }
  render() {
    if (this.caseDetailsNotYetLoaded()) return null;
    const caseId = this.props.match.params.id;
    const caseOfficerId = this.props.match.params.caseOfficerId;
    return (
      <OfficerDetailsContainer
        caseId={caseId}
        titleAction={"Edit"}
        submitButtonText={"Save Officer"}
        submitAction={editThunkWrapper(caseId, caseOfficerId)}
        officerSearchUrl={`/cases/${caseId}/officers/${caseOfficerId}/search`}
      />
    );
  }
}

const mapStateToProps = state => ({
  caseDetails: state.currentCase.details
});

const mapDispatchToProps = {
  invalidCaseStatusRedirect,
  getCaseDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditOfficerDetails);
