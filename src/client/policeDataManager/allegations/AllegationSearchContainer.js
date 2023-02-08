import React, { Component } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import { Table, TableBody, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import LinkButton from "../shared/components/LinkButton";
import { connect } from "react-redux";
import OfficerSearchResultsRow from "../officers/OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import OfficerSearchTableHeader from "../officers/OfficerSearch/OfficerSearchTableHeader";
import AllegationSearch from "./AllegationSearch";
import OfficerAllegations from "./OfficerAllegations";
import invalidCaseStatusRedirect from "../cases/thunks/invalidCaseStatusRedirect";
import { CONFIGS, OFFICER_TITLE } from "../../../sharedUtilities/constants";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
export class AllegationSearchContainer extends Component {
  caseDetailsNotYetLoaded = () => {
    return (
      !this.props.caseDetails ||
      `${this.props.caseDetails.id}` !== this.props.match.params.id
    );
  };

  componentDidMount() {
    if (this.props.match.params.id !== `${this.props.caseDetails.id}`) {
      this.props.getCaseDetails(this.props.match.params.id);
    }
  }

  componentDidUpdate() {
    if (!this.caseDetailsNotYetLoaded() && this.props.caseDetails.isArchived) {
      this.props.invalidCaseStatusRedirect(this.props.caseDetails.id);
    }
  }

  render() {
    let currentCaseOfficerData;

    const { id: caseId, caseOfficerId } = this.props.match.params;

    if (this.props.caseDetails.accusedOfficers) {
      currentCaseOfficerData = this.props.caseDetails.accusedOfficers.find(
        caseOfficer => {
          return caseOfficer.id === parseInt(caseOfficerId, 10);
        }
      );
    } else {
      return null;
    }

    if (!currentCaseOfficerData) {
      return null;
    }

    const isCivilianWithinPd =
      PERSON_TYPE.CIVILIAN_WITHIN_PD &&
      currentCaseOfficerData.caseEmployeeType ===
        PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription;
    const titleText = isCivilianWithinPd
      ? `Accused Civilian (${this.props.pd})`
      : `Accused ${OFFICER_TITLE}`;

    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions}>
          {`Case #${this.props.caseDetails.caseReference}   : Manage Allegations`}
        </NavBar>
        <LinkButton
          data-testid="back-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Back to Case
        </LinkButton>
        <div style={{ margin: "0% 5% 3%" }}>
          <Typography variant="h6">{titleText}</Typography>
          <Table>
            <OfficerSearchTableHeader />
            <TableBody>
              <OfficerSearchResultsRow officer={currentCaseOfficerData} />
            </TableBody>
          </Table>
          {currentCaseOfficerData.allegations.length !== 0 && (
            <OfficerAllegations
              officerAllegations={currentCaseOfficerData.allegations}
              caseId={caseId}
            />
          )}
        </div>
        <div style={{ margin: "0% 5% 3%" }}>
          <AllegationSearch caseId={caseId} caseOfficerId={caseOfficerId} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseDetails: state.currentCase.details,
  pd: state.configs[CONFIGS.PD]
});

const mapDispatchToProps = {
  invalidCaseStatusRedirect,
  getCaseDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllegationSearchContainer);
