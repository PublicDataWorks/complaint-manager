import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "../../shared/components/NavBar/NavBar";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import OfficerDetails from "./OfficerDetails";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import { push } from "react-router-redux";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

export class OfficerDetailsContainer extends Component {
  componentDidMount() {
    if (!this.props.officerCurrentlySelected) {
      this.props.dispatch(push(this.props.officerSearchUrl));
      this.props.dispatch(
        snackbarError("Please select an officer or unknown officer to continue")
      );
    }
  }

  render() {
    const {
      selectedOfficerData,
      caseId,
      titleAction,
      submitButtonText,
      submitAction,
      officerSearchUrl
    } = this.props;

    const selectedOfficerId = selectedOfficerData && selectedOfficerData.id;

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
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
        <div style={{ margin: "0% 5% 3%" }}>
          <OfficerDetails
            officerSearchUrl={officerSearchUrl}
            submitAction={submitAction(selectedOfficerId)}
            submitButtonText={submitButtonText}
            caseId={caseId}
            selectedOfficerData={selectedOfficerData}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedOfficerData: state.officers.selectedOfficerData,
  officerCurrentlySelected: state.officers.officerCurrentlySelected
});

export default connect(mapStateToProps)(OfficerDetailsContainer);
