import React, { Component } from "react";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import LinkButton from "../../../shared/components/LinkButton";
import CaseHistoryTable from "./CaseHistoryTable";
import getCaseHistory from "../../thunks/getCaseHistory";
import { connect } from "react-redux";

export class CaseHistory extends Component {
  componentDidMount() {
    this.props.getCaseHistory(this.props.match.params.id);
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
            {`Case #${caseId} : Case History`}
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
  getCaseHistory
};

export default connect(undefined, mapDispatchToProps)(CaseHistory);
