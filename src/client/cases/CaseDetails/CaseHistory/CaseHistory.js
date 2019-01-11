import React, { Component } from "react";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import LinkButton from "../../../shared/components/LinkButton";
import CaseHistoryTable from "./CaseHistoryTable";
import getCaseHistory from "../../thunks/getCaseHistory";
import { connect } from "react-redux";
import getMinimumCaseDetails from "../../thunks/getMinimumCaseDetails";

export class CaseHistory extends Component {
  componentDidMount() {
    const caseId = this.props.match.params.id;
    this.props.getCaseHistory(caseId);
    this.props.getMinimumCaseDetails(caseId);
  }

  render() {
    const caseId = this.props.match.params.id;
    return (
      <div>
        <NavBar>
          <Typography
            data-test="pageTitle"
            variant="title"
            color="inherit"
            style={{ marginRight: "20px" }}
          >
            {`Case #${this.props.caseReference} : Case History`}
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
  caseReference: state.currentCase.details.caseReference
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseHistory);
