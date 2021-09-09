import { editThunkWrapper } from "../thunks/officerThunkWrappers";
import React from "react";
import OfficerDetailsContainer from "./OfficerDetailsContainer";
import { connect } from "react-redux";
import invalidCaseStatusRedirect from "../../cases/thunks/invalidCaseStatusRedirect";
import getCaseDetails from "../../cases/thunks/getCaseDetails";
import { OFFICER_TITLE } from "../../../../sharedUtilities/constants";

const {
  CIVILIAN_WITHIN_PD_TITLE,
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

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
    const isCivilianWithinPd =
      this.props.caseEmployeeType ===
      PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription;
    const submitButtonText = isCivilianWithinPd
      ? `Save ${CIVILIAN_WITHIN_PD_TITLE}`
      : `Save ${OFFICER_TITLE}`;

    return (
      <OfficerDetailsContainer
        caseId={caseId}
        titleAction={"Edit"}
        submitButtonText={submitButtonText}
        submitAction={editThunkWrapper(caseId, caseOfficerId)}
        officerSearchUrl={`/cases/${caseId}/officers/${caseOfficerId}/search`}
        caseEmployeeType={this.props.caseEmployeeType}
      />
    );
  }
}

const mapStateToProps = state => ({
  caseDetails: state.currentCase.details,
  caseEmployeeType: state.officers.addOfficer.caseEmployeeType
});

const mapDispatchToProps = {
  invalidCaseStatusRedirect,
  getCaseDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(EditOfficerDetails);
