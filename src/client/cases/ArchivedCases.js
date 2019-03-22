import React, { Component } from "react";
import CasesTable from "./CasesTable/CasesTable";
import NavBar from "../shared/components/NavBar/NavBar";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { closeSnackbar } from "../actionCreators/snackBarActionCreators";
import getArchivedCases from "./thunks/getArchivedCases";
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
        <CasesTable archived={true} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  closeSnackbar,
  resetArchivedCasesLoaded
};

export default connect(
  null,
  mapDispatchToProps
)(ArchivedCases);
