import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "../../shared/components/NavBar/NavBar";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import OfficerDetails from "./OfficerDetails";
import {
  clearCaseEmployeeType,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import { push } from "connected-react-router";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import { CONFIGS, OFFICER_TITLE } from "../../../../sharedUtilities/constants";
import { policeDataManagerMenuOptions } from "../../shared/components/NavBar/policeDataManagerMenuOptions";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
export class OfficerDetailsContainer extends Component {
  componentDidMount() {
    const snackbarErrorText =
      "Please select an employee or unknown officer to continue";
    if (!this.props.officerCurrentlySelected) {
      this.props.dispatch(push(this.props.officerSearchUrl));
      this.props.dispatch(snackbarError(snackbarErrorText));
    }
  }

  render() {
    const {
      caseEmployeeType,
      caseId,
      caseReference,
      dispatch,
      initialRoleOnCase,
      officerSearchUrl,
      pd,
      selectedOfficerData,
      submitAction,
      submitButtonText,
      titleAction
    } = this.props;

    const clearOfficersAndEmployeeTypeAction = () => {
      dispatch(clearCaseEmployeeType());
      dispatch(clearSelectedOfficer());
    };

    const caseEmployeeTitle =
      caseEmployeeType === PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
        ? `Civilian (${pd})`
        : OFFICER_TITLE;

    const selectedOfficerId = selectedOfficerData && selectedOfficerData.id;

    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions}>
          {`Case #${caseReference}   : ${titleAction} ${caseEmployeeTitle}`}
        </NavBar>
        <LinkButton
          data-testid="back-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
          onClick={clearOfficersAndEmployeeTypeAction}
        >
          Back to Case
        </LinkButton>
        <div style={{ margin: "0% 5% 3%", maxWidth: "60rem" }}>
          <OfficerDetails
            officerSearchUrl={officerSearchUrl}
            submitAction={submitAction(selectedOfficerId, caseEmployeeType)}
            submitButtonText={submitButtonText}
            caseId={caseId}
            selectedOfficer={selectedOfficerData}
            initialRoleOnCase={initialRoleOnCase}
            caseEmployeeTitle={caseEmployeeTitle}
            caseEmployeeType={caseEmployeeType}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let initialRoleOnCaseProp = null;
  if (state.form.OfficerDetails && state.form.OfficerDetails.initial) {
    initialRoleOnCaseProp = state.form.OfficerDetails.initial.roleOnCase;
  }
  return {
    caseReference: state.currentCase.details.caseReference,
    initialRoleOnCase: initialRoleOnCaseProp,
    officerCurrentlySelected:
      state.officers.searchOfficers.officerCurrentlySelected,
    pd: state.configs[CONFIGS.PD],
    selectedOfficerData: state.officers.searchOfficers.selectedOfficerData
  };
};

export default connect(mapStateToProps)(OfficerDetailsContainer);
