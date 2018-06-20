import React, { Component } from "react";
import { connect } from "react-redux";
import AllegationSearchTableHeader from "./AllegationSearchTableHeader";
import AllegationSearchResultsRow from "./AllegationSearchResultsRow";
import SearchResults from "../shared/components/SearchResults";

export class AllegationSearchResults extends Component {
  render() {
    return (
      <SearchResults
        searchResults={this.props.searchResults}
        spinnerVisible={this.props.spinnerVisible}
        tableHeaderComponent={<AllegationSearchTableHeader />}
        dispatch={this.props.dispatch}
        render={allegation => (
          <AllegationSearchResultsRow
            key={allegation.id}
            allegation={allegation}
            caseId={this.props.caseId}
            caseOfficerId={this.props.caseOfficerId}
          />
        )}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    currentCase: state.currentCase.details,
    searchResults: state.ui.search.searchResults.rows,
    spinnerVisible: state.ui.search.spinnerVisible
  };
};

export default connect(mapStateToProps)(AllegationSearchResults);
