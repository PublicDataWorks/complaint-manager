import React, { Component } from "react";
import { connect } from "react-redux";
import OfficerSearchResultsRow from "./OfficerSearchResultsRow";
import OfficerSearchTableHeader from "../OfficerSearchTableHeader";
import {
  PreviouslyAddedOfficer,
  SelectNewOfficer
} from "./officerSearchResultsRowButtons";
import SearchResults from "../../../shared/components/SearchResults";
import getSearchResults from "../../../shared/thunks/getSearchResults";
import { OFFICER_SEARCH_FORM_NAME } from "../../../../../sharedUtilities/constants";
import { searchCleared } from "../../../actionCreators/searchActionCreators";

export class OfficerSearchResults extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(searchCleared());
  }

  normalizeValues(values) {
    const normalizedValues = values.directive && {
      directive: values.directive.trim()
    };
    return { ...values, ...normalizedValues };
  }

  onChange(currentPage) {
    const values = this.props.form[OFFICER_SEARCH_FORM_NAME].values;
    const paginatingSearch = true;

    this.props.dispatch(
      getSearchResults(
        this.normalizeValues(values),
        "officers",
        paginatingSearch,
        currentPage
      )
    );

    if (document.getElementsByClassName("officerSearchHeader").length > 0) {
      document
        .getElementsByClassName("officerSearchHeader")[0]
        .scrollIntoView(true);
    }
  }

  render() {
    return (
      <SearchResults
        pagination={{
          onChange: this.onChange,
          totalMessage: total => `${total} results found`,
          count: this.props.count,
          currentPage: this.props.newPage
        }}
        searchResultsLength={
          this.props.searchResults ? this.props.searchResults.length : 0
        }
        spinnerVisible={this.props.spinnerVisible}
        tableHeaderComponent={<OfficerSearchTableHeader />}
      >
        {this.props.searchResults
          ? this.props.searchResults.map(officer => (
              <OfficerSearchResultsRow key={officer.id} officer={officer}>
                {this.props.officerIds.includes(officer.id) ? (
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
            ))
          : ""}
      </SearchResults>
    );
  }
}

const mapStateToProps = state => {
  if (state.currentCase.details.accusedOfficers) {
    return {
      caseDetails: state.currentCase.details,
      searchResults: state.ui.search.searchResults.rows,
      spinnerVisible: state.ui.search.spinnerVisible,
      count: state.ui.search.searchResults.count,
      newPage: state.ui.search.newPage,
      form: state.form,
      officerIds: state.currentCase.details.accusedOfficers
        .concat(state.currentCase.details.complainantOfficers)
        .concat(state.currentCase.details.witnessOfficers)
        .map(caseOfficer => caseOfficer.officerId)
    };
  }
  return {};
};

export default connect(mapStateToProps)(OfficerSearchResults);
