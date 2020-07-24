import React, { Component } from "react";
import CasesTable from "./CasesTable/CasesTable";
import CreateCaseButton from "./CreateCaseButton";
import NavBar from "../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import {
  resetWorkingCasesLoaded,
  updateSort
} from "../actionCreators/casesActionCreators";
import { complaintManagerMenuOptions } from "../shared/components/NavBar/complaintManagerMenuOptions";
import ComplaintTotals from "./ComplaintTotals";
import { closeCreateDialog } from "../../common/actionCreators/createDialogActionCreators";
import { DialogTypes } from "../../common/actionCreators/dialogTypes";

class CaseDashboard extends Component {
  componentWillUnmount() {
    this.props.closeCreateDialog(DialogTypes.CASE);
    this.props.resetWorkingCasesLoaded();
  }

  render() {
    return (
      <div>
        <NavBar menuType={complaintManagerMenuOptions}>View All Cases</NavBar>
        <ComplaintTotals />
        <CreateCaseButton />
        <CasesTable currentPage={this.props.currentPage} archived={false} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateSort,
  resetWorkingCasesLoaded,
  closeCreateDialog
};

const mapStateToProps = (state, ownProps) => ({
  currentPage: state.cases.working.currentPage
});

export default connect(mapStateToProps, mapDispatchToProps)(CaseDashboard);
