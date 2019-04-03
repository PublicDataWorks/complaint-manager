import React, { Component } from "react";
import CasesTable from "./CasesTable/CasesTable";
import NavBar from "../shared/components/NavBar/NavBar";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { closeSnackbar } from "../actionCreators/snackBarActionCreators";
import { resetArchivedCasesLoaded } from "../actionCreators/casesActionCreators";

class ArchivedCases extends Component {
  componentWillUnmount() {
    this.props.resetArchivedCasesLoaded();
  }

  render() {
    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            View Archived Cases
          </Typography>
        </NavBar>
        <CasesTable archived={true} currentPage={this.props.currentPage} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  closeSnackbar,
  resetArchivedCasesLoaded
};

const mapStateToProps = (state, ownProps) => ({
  currentPage: state.cases.archived.currentPage
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchivedCases);
