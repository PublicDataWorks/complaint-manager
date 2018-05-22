import React, { Component } from "react";
import { connect } from "react-redux";
import OfficerSearchResultsRow from "./OfficerSearchResultsRow";
import { searchOfficersCleared } from "../../../actionCreators/officersActionCreators";
import OfficerSearchTableHeader from "../OfficerSearchTableHeader";
import {
  PreviouslyAddedOfficer,
  SelectNewOfficer
} from "./officerSearchResultsRowButtons";
import SearchResults from "../../../sharedComponents/SearchResults";

export class OfficerSearchResults extends Component {
  render() {
    return (
      <SearchResults
        searchResults={this.props.searchResults}
        spinnerVisible={this.props.spinnerVisible}
        searchResultsIds={this.props.officerIds}
        tableHeaderComponent={<OfficerSearchTableHeader />}
        clearMethod={searchOfficersCleared}
        dispatch={this.props.dispatch}
        render={(officer, officerIds) => (
          <OfficerSearchResultsRow key={officer.id} officer={officer}>
            {officerIds.includes(officer.id) ? (
              <PreviouslyAddedOfficer />
            ) : (
              <SelectNewOfficer
                initialize={this.props.initialize}
                dispatch={this.props.dispatch}
                officer={officer}
                path={this.props.path}
              />
            )}
          </OfficerSearchResultsRow>
        )}
      />
    );
  }
}

const mapStateToProps = state => {
  if (state.currentCase.details.accusedOfficers) {
    return {
      currentCase: state.currentCase.details,
      searchResults: state.officers.searchResults,
      spinnerVisible: state.officers.spinnerVisible,
      officerIds: state.currentCase.details.accusedOfficers
        .concat(state.currentCase.details.complainantWitnessOfficers)
        .map(officer => officer.officerId)
    };
  }
  return {};
};

export default connect(mapStateToProps)(OfficerSearchResults);
