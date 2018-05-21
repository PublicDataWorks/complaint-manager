import React from "react";
import OfficerSearchContainer from "./OfficerSearchContainer";
import { initialize } from "redux-form";
import getCaseDetails from "../../cases/thunks/getCaseDetails";
import { connect } from "react-redux";

class AddOfficerSearch extends React.Component {
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

    return (
      <OfficerSearchContainer
        initialize={initialize("OfficerDetails", { roleOnCase: "Accused" })}
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
