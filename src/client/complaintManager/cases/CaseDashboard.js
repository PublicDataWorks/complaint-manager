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
import { Visualization } from "../../common/components/Visualization/Visualization";
import { QUERY_TYPES } from "../../../sharedUtilities/constants";

class CaseDashboard extends Component {
  componentWillUnmount() {
    this.props.resetWorkingCasesLoaded();
  }

  render() {
    return (
      <div>
        <NavBar menuType={complaintManagerMenuOptions}>View All Cases</NavBar>
        <CreateCaseButton />
        <CasesTable currentPage={this.props.currentPage} archived={false} />
        {this.props.dataVisualizationFeature ? (
        <div data-testid={"dataVisualization"}>
        {this.props.isTest || false ? <div >This is a test</div> : 
          <Visualization
            queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE}
          />
        }
        </div>
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateSort,
  resetWorkingCasesLoaded
};

const mapStateToProps = (state, ownProps) => ({
  currentPage: state.cases.working.currentPage,
  dataVisualizationFeature: state.featureToggles.dataVisualizationFeature
});

export default connect(mapStateToProps, mapDispatchToProps)(CaseDashboard);
