import React, { Component } from "react";
import CasesTable from "./CasesTable/CasesTable";
import NavBar from "../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import { closeSnackbar } from "../actionCreators/snackBarActionCreators";
import { resetArchivedCasesLoaded } from "../actionCreators/casesActionCreators";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import { CASE_TYPE } from "../../../sharedUtilities/constants";

class ArchivedCases extends Component {
  componentWillUnmount() {
    this.props.resetArchivedCasesLoaded();
  }

  render() {
    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions}>
          View Archived Cases
        </NavBar>
        <CasesTable
          caseType={CASE_TYPE.ARCHIVE}
          currentPage={this.props.currentPage}
          noCasesMessage={"There are no archived cases to view."}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(ArchivedCases);
