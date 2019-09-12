import React, { Component } from "react";
import CasesTable from "./CasesTable/CasesTable";
import NavBar from "../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import { closeSnackbar } from "../actionCreators/snackBarActionCreators";
import { resetArchivedCasesLoaded } from "../actionCreators/casesActionCreators";
import { complaintManagerMenuOptions } from "../shared/components/NavBar/complaintManagerMenuOptions";

class ArchivedCases extends Component {
  componentWillUnmount() {
    this.props.resetArchivedCasesLoaded();
  }

  render() {
    return (
      <div>
        <NavBar menuType={complaintManagerMenuOptions}>
          View Archived Cases
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
