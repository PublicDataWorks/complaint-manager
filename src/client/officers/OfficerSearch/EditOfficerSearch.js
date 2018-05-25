import React from "react";
import OfficerSearchContainer from "./OfficerSearchContainer";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import getCaseDetails from "../../cases/thunks/getCaseDetails";

class EditOfficerSearch extends React.Component {
  missingCaseDetails = () => {
    return (
      !this.props.currentCase ||
      `${this.props.currentCase.id}` !== this.props.match.params.id
    );
  };
  componentDidMount() {
    if (this.missingCaseDetails()) {
      this.props.dispatch(getCaseDetails(this.props.match.params.id));
    }
  }

  render() {
    if (this.missingCaseDetails()) return null;

    const caseId = this.props.match.params.id;
    const caseOfficerId = this.props.match.params.caseOfficerId;

    const allOfficers = this.props.accusedOfficers
      .concat(this.props.complainantOfficers)
      .concat(this.props.witnessOfficers);

    const currentCaseOfficer = allOfficers.find(
      caseOfficer => caseOfficer && `${caseOfficer.id}` === caseOfficerId
    );

    const initializeCaseDetails = initialize(
      "OfficerDetails",
      currentCaseOfficer
    );

    return (
      <OfficerSearchContainer
        caseId={caseId}
        titleAction={"Edit"}
        initialize={initializeCaseDetails}
        officerDetailsPath={`/cases/${caseId}/officers/${caseOfficerId}`}
      />
    );
  }
}

const mapStateToProps = state => ({
  currentCase: state.currentCase.details,
  accusedOfficers: state.currentCase.details.accusedOfficers,
  complainantOfficers: state.currentCase.details.complainantOfficers,
  witnessOfficers: state.currentCase.details.witnessOfficers
});

export default connect(mapStateToProps)(EditOfficerSearch);
