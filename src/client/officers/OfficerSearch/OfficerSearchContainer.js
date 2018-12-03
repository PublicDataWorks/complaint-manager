import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "../../shared/components/NavBar/NavBar";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import OfficerSearch from "./OfficerSearch";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";

export class OfficerSearchContainer extends Component {
  componentDidMount() {
    this.props.dispatch(clearSelectedOfficer());
  }

  render() {
    const { caseId, titleAction, officerDetailsPath } = this.props;

    return (
      <div>
        <NavBar>
          <Typography
            data-test="officer-search-title"
            variant="title"
            color="inherit"
          >
            {`Case #${caseId}   : ${titleAction} Officer`}
          </Typography>
        </NavBar>
        <LinkButton
          data-test="back-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
          onClick={() => this.props.dispatch(clearSelectedOfficer())}
        >
          Back to Case
        </LinkButton>
        <div style={{ margin: "0% 5% 3%", maxWidth: "60rem" }}>
          <OfficerSearch
            initialize={this.props.initialize}
            dispatch={this.props.dispatch}
            path={officerDetailsPath}
          />
        </div>
      </div>
    );
  }
}

export default connect()(OfficerSearchContainer);
