import React from "react";
import OfficerSearchContainer from "./OfficerSearchContainer";
import { connect } from "react-redux";
import { initialize } from "redux-form";

import getCaseDetails from "../../cases/thunks/getCaseDetails";
import invalidCaseStatusRedirect from "../../cases/thunks/invalidCaseStatusRedirect";
import { OFFICER_DETAILS_FORM_NAME } from "../../../../sharedUtilities/constants";

class EditOfficerSearch extends React.Component {
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
      const caseId = this.props.caseDetails.id;
      this.props.invalidCaseStatusRedirect(caseId);
    }
  }

  render() {
    if (this.caseDetailsNotYetLoaded()) return null;

    const caseId = this.props.match.params.id;
    const caseOfficerId = this.props.match.params.caseOfficerId;

    const allOfficers = this.props.accusedOfficers
      .concat(this.props.complainantOfficers)
      .concat(this.props.witnessOfficers);

    console.log(this.props.accusedOfficers, allOfficers);
    const currentCaseOfficer = allOfficers.find(
      caseOfficer => caseOfficer && `${caseOfficer.id}` === caseOfficerId
    );

    const initializeCaseDetails = initialize(OFFICER_DETAILS_FORM_NAME, {
      notes: currentCaseOfficer.notes,
      roleOnCase: currentCaseOfficer.roleOnCase,
      officerId: currentCaseOfficer.officerId,
      phoneNumber: currentCaseOfficer.phoneNumber,
      email: currentCaseOfficer.email
    });

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
  caseDetails: state.currentCase.details,
  accusedOfficers: state.currentCase.details.accusedOfficers,
  complainantOfficers: state.currentCase.details.complainantOfficers,
  witnessOfficers: state.currentCase.details.witnessOfficers
});

const mapDispatchToProps = {
  invalidCaseStatusRedirect,
  getCaseDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(EditOfficerSearch);
