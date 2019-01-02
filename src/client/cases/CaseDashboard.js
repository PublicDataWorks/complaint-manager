import React, { Component } from "react";
import CasesTable from "./CasesTable/CasesTable";
import CreateCaseDialog from "./CreateCaseDialog/CreateCaseDialog";
import NavBar from "../shared/components/NavBar/NavBar";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { closeSnackbar } from "../actionCreators/snackBarActionCreators";

class CaseDashboard extends Component {
  componentDidMount() {
    this.props.closeSnackbar();
  }

  render() {
    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            View All Cases
          </Typography>
        </NavBar>
        <CreateCaseDialog />
        <CasesTable />
      </div>
    );
  }
}

export default connect(
  undefined,
  { closeSnackbar }
)(CaseDashboard);
