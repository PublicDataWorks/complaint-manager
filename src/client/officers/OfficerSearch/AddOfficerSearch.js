import React from "react";
import OfficerSearchContainer from "./OfficerSearchContainer";
import getCaseDetails from "../../cases/thunks/getCaseDetails";
import { connect } from "react-redux";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";

export class AddOfficerSearch extends React.Component {
  missingCaseDetails = () => {
    return (
      !this.props.currentCase ||
      `${this.props.currentCase.id}` !== this.props.match.params.id
    );
  };
  componentDidMount() {
    this.props.dispatch(clearSelectedOfficer());
    if (this.missingCaseDetails()) {
      this.props.dispatch(getCaseDetails(this.props.match.params.id));
    }
  }

  render() {
    if (this.missingCaseDetails()) return null;
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
  currentCase: state.currentCase.details
});
export default connect(mapStateToProps)(AddOfficerSearch);
