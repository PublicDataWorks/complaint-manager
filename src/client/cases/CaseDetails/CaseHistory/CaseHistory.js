import React, { Component } from "react";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Link } from "react-router-dom";
import LinkButton from "../../../shared/components/LinkButton";
import CaseHistoryTable from "./CaseHistoryTable";
import getCaseHistory from "../../thunks/getCaseHistory";
import { connect } from "react-redux";
import getMinimumCaseDetails from "../../thunks/getMinimumCaseDetails";
import _ from "lodash";
import { complaintManagerMenuOptions } from "../../../shared/components/NavBar/complaintManagerMenuOptions";

export class CaseHistory extends Component {
  componentDidMount() {
    const caseId = this.props.match.params.id;
    this.props.getCaseHistory(caseId);
    this.props.getMinimumCaseDetails(caseId);
  }

  caseHistoryNotYetLoaded() {
    return (
      _.isEmpty(this.props.currentCase.caseHistory) ||
      this.props.currentCase.details.caseReference === undefined
    );
  }

  render() {
    if (this.caseHistoryNotYetLoaded()) {
      return null;
    }

    const caseId = this.props.match.params.id;
    return (
      <div>
        <NavBar menuType={complaintManagerMenuOptions}>
          {`Case #${this.props.currentCase.details.caseReference} : Case History`}
        </NavBar>
        <LinkButton
          data-test="back-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Back to Case
        </LinkButton>
        <CaseHistoryTable />
      </div>
    );
  }
}

const mapDispatchToProps = {
  getMinimumCaseDetails,
  getCaseHistory
};

const mapStateToProps = state => ({
  currentCase: state.currentCase
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseHistory);
