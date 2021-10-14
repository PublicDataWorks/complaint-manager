import React, { Component } from "react";
import CasesTable from "../CasesTable/CasesTable";
import NavBar from "../../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import { updateSort } from "../../actionCreators/casesActionCreators";
import { policeDataManagerMenuOptions } from "../../shared/components/NavBar/policeDataManagerMenuOptions";
import { CASE_TYPE } from "../../../../sharedUtilities/constants";

class SearchCasesPage extends Component {
  render() {
    return (
      <>
        <NavBar menuType={policeDataManagerMenuOptions} showSearchBar>
          Search Results
        </NavBar>
        <CasesTable
          currentPage={this.props.currentPage}
          caseType={CASE_TYPE.SEARCH}
          noCasesMessage={"No complaints matched your search."}
          sortBy={this.props.sortBy}
          sortDirection={this.props.sortDirection}
        />
      </>
    );
  }
}

const mapDispatchToProps = { updateSort };

const mapStateToProps = state => {
  const { currentPage, sortBy, sortDirection } = state.cases.search;
  return {
    currentPage,
    sortBy,
    sortDirection
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchCasesPage);
