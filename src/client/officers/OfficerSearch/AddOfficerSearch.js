import React from "react";
import OfficerSearchContainer from "./OfficerSearchContainer";
import getCaseDetails from "../../cases/thunks/getCaseDetails";
import { connect } from "react-redux";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import invalidCaseStatusRedirect from "../../cases/thunks/invalidCaseStatusRedirect";

export class AddOfficerSearch extends React.Component {
  caseDetailsNotYetLoaded = () => {
    return (
      !this.props.caseDetails ||
      `${this.props.caseDetails.id}` !== this.props.match.params.id
    );
  };
  componentDidMount() {
    this.props.clearSelectedOfficer();
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

    return (
      <OfficerSearchContainer
        caseId={caseId}
        titleAction={"Add"}
        officerDetailsPath={`/cases/${caseId}/officers/details`}
      />
    );
  }
}

const mapStateToProps = state => ({
  caseDetails: state.currentCase.details
});

const mapDispatchToProps = {
  invalidCaseStatusRedirect,
  clearSelectedOfficer,
  getCaseDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddOfficerSearch);
