import React, { Component } from "react";
import CasesTable from "./CasesTable/CasesTable";
import CreateCaseDialog from "./CreateCaseDialog/CreateCaseDialog";
import CaseCreationSnackbar from "./CaseCreationSnackbar/CaseCreationSnackbar";
import NavBar from "../sharedComponents/NavBar/NavBar";
import { Typography } from "material-ui";
import { connect } from "react-redux";
import { closeSnackbar } from "../actionCreators/snackBarActionCreators";
import getCases from "./thunks/getCases";

class CaseDashboard extends Component {
  componentWillMount() {
    this.props.getCases();
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
        <CaseCreationSnackbar />
      </div>
    );
  }
}

const mapDispatchToProps = {
  getCases,
  closeSnackbar
};

export default connect(undefined, mapDispatchToProps)(CaseDashboard);
