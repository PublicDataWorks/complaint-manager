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

export class AllegationSearchContainer extends Component {
  componentDidMount() {
    if (this.props.match.params.id !== this.props.caseDetails.id) {
      this.props.dispatch(getCaseDetails(this.props.match.params.id));
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

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${caseId}   : Manage Allegations`}
          </Typography>
        </NavBar>
        <LinkButton
          data-test="back-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Back to Case
        </LinkButton>
        <div style={{ margin: "0% 5% 3%" }}>
          <Typography variant="title">Accused Officer</Typography>
          <Table style={{ marginBottom: "32px" }}>
            <OfficerSearchTableHeader />
            <TableBody>
              <OfficerSearchResultsRow officer={currentCaseOfficerData} />
              {currentCaseOfficerData.allegations.length !== 0 && (
                <OfficerAllegations
                  officerAllegations={currentCaseOfficerData.allegations}
                  caseId={caseId}
                />
              )}
            </TableBody>
          </Table>
        </div>
        <div style={{ margin: "0% 5% 3%" }}>
          <AllegationSearch caseId={caseId} caseOfficerId={caseOfficerId} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseDetails: state.currentCase.details
});

export default connect(mapStateToProps)(AllegationSearchContainer);
