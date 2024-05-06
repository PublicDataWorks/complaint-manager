import React, { Component } from "react";
import CasesTable from "./CasesTable/CasesTable";
import CreateCaseButton from "./CreateCaseButton";
import NavBar from "../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import {
  resetWorkingCasesLoaded,
  updateSort
} from "../actionCreators/casesActionCreators";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import ComplaintTotals from "./ComplaintTotals";
import { closeCreateDialog } from "../../common/actionCreators/createDialogActionCreators";
import { DialogTypes } from "../../common/actionCreators/dialogTypes";
import {
  CASE_TYPE,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";

class CaseDashboard extends Component {
  componentWillUnmount() {
    this.props.closeCreateDialog(DialogTypes.CASE);
    this.props.resetWorkingCasesLoaded();
  }

  render() {
    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions} showSearchBar>
          View All Cases
        </NavBar>
        <ComplaintTotals />
        {this.props?.permissions?.includes(USER_PERMISSIONS.CREATE_CASE) && <CreateCaseButton />}
        <CasesTable
          currentPage={this.props.currentPage}
          caseType={CASE_TYPE.WORKING}
          noCasesMessage={"There are no cases to view."}
          sortBy={this.props.sortBy}
          sortDirection={this.props.sortDirection}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateSort,
  resetWorkingCasesLoaded,
  closeCreateDialog,
};

const mapStateToProps = state => {
  const { currentPage, sortBy, sortDirection } = state.cases.working;
  return {
    currentPage,
    sortBy,
    sortDirection,
    permissions: state?.users?.current?.userInfo?.permissions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseDashboard);
