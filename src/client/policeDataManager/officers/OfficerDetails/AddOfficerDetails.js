import { addThunkWrapper } from "../thunks/officerThunkWrappers";
import React from "react";
import OfficerDetailsContainer from "./OfficerDetailsContainer";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import { connect } from "react-redux";
import invalidCaseStatusRedirect from "../../cases/thunks/invalidCaseStatusRedirect";
import getCaseDetails from "../../cases/thunks/getCaseDetails";
import { OFFICER_TITLE } from "../../../../sharedUtilities/constants";
const {
  CIVILIAN_WITHIN_PD_TITLE,
  EMPLOYEE_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

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
    const isCivilianWithinPd =
      this.props.caseEmployeeType === EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD;
    const submitButtonText = isCivilianWithinPd
      ? `Add ${CIVILIAN_WITHIN_PD_TITLE} to Case`
      : `Add ${OFFICER_TITLE} to Case`;

    return (
      <OfficerDetailsContainer
        caseId={caseId}
        titleAction={"Add"}
        submitButtonText={submitButtonText}
        submitAction={addThunkWrapper(caseId)}
        officerSearchUrl={`/cases/${caseId}/officers/search`}
        caseEmployeeType={this.props.caseEmployeeType}
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
  caseDetails: state.currentCase.details,
  caseEmployeeType: state.officers.addOfficer.caseEmployeeType
});

export default connect(mapStateToProps, mapDispatchToProps)(AddOfficerDetails);
