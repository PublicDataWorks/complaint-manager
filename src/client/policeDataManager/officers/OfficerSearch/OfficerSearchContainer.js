import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "../../shared/components/NavBar/NavBar";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import OfficerSearch from "./OfficerSearch";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import { CONFIGS, OFFICER_TITLE } from "../../../../sharedUtilities/constants";
import { policeDataManagerMenuOptions } from "../../shared/components/NavBar/policeDataManagerMenuOptions";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
export class OfficerSearchContainer extends Component {
  componentDidMount() {
    this.props.dispatch(clearSelectedOfficer());
  }

  render() {
    const { caseEmployeeType, caseId, officerDetailsPath, pd, titleAction } =
      this.props;

    const employeeSearchTitle =
      caseEmployeeType === PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
        ? `Civilian (${pd})`
        : OFFICER_TITLE;

    return (
      <div>
        <NavBar
          menuType={policeDataManagerMenuOptions}
          dataTest={"officer-search-title"}
        >
          {`Case #${this.props.caseReference}   : ${titleAction} ${employeeSearchTitle}`}
        </NavBar>
        <LinkButton
          data-testid="back-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Back to Case
        </LinkButton>
        <div style={{ margin: "0% 5% 3%", maxWidth: "60rem" }}>
          <OfficerSearch
            initialize={this.props.initialize}
            dispatch={this.props.dispatch}
            path={officerDetailsPath}
            employeeSearchTitle={employeeSearchTitle}
            caseEmployeeType={caseEmployeeType}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseEmployeeType: state.officers.addOfficer.caseEmployeeType,
  caseReference: state.currentCase.details.caseReference,
  pd: state.configs[CONFIGS.PD]
});

export default connect(mapStateToProps)(OfficerSearchContainer);
