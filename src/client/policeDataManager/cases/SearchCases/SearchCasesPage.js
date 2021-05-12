import React, { Component } from "react";
import CasesTable from "../CasesTable/CasesTable";
import NavBar from "../../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import { updateSort } from "../../actionCreators/casesActionCreators";
import { policeDataManagerMenuOptions } from "../../shared/components/NavBar/policeDataManagerMenuOptions";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";

class SearchCasesPage extends Component {
  render() {
    return (
      <>
        <NavBar menuType={policeDataManagerMenuOptions} showSearchBar>
          Search Results
        </NavBar>
        <CasesTable
          searchResults
          currentPage={1}
          noCasesMessage={"No complaints matched your search."}
        />
      </>
    );
  }
}

const mapDispatchToProps = { updateSort };

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SearchCasesPage);
