import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "rc-pagination/assets/index.css";
import "./pagination.css";
import AllegationSearchTableHeader from "./AllegationSearchTableHeader";
import AllegationSearchResultsRow from "./AllegationSearchResultsRow";
import SearchResults from "../shared/components/SearchResults";
import getSearchResults from "../shared/thunks/getSearchResults";
import {
  ALLEGATION_SEARCH_FORM_NAME,
  DEFAULT_PAGINATION_LIMIT
} from "../../sharedUtilities/constants";

export class AllegationSearchResults extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(currentPage, pageSize) {
    const offset = (currentPage - 1) * pageSize;
    const values = this.props.form[ALLEGATION_SEARCH_FORM_NAME].values;

    const normalizeValues = values => {
      const normalizedValues = values.directive && {
        directive: values.directive.trim()
      };
      return { ...values, ...normalizedValues };
    };

    const normalizedValues = {
      ...normalizeValues(values),
      offset: offset,
      limit: DEFAULT_PAGINATION_LIMIT
    };
    const paginatingSearch = true;

    this.props.dispatch(
      getSearchResults(
        normalizedValues,
        "allegations",
        paginatingSearch,
        currentPage
      )
    );

    if (document.getElementsByClassName("allegationSearchHeader").length > 0) {
      document
        .getElementsByClassName("allegationSearchHeader")[0]
        .scrollIntoView(true);
    }
  }

  render() {
    return (
      <Fragment>
        <SearchResults
          pagination={{
            onChange: this.onChange,
            totalMessage: total => `${total} results found`,
            count: this.props.count,
            currentPage: this.props.newPage
          }}
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
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentCase: state.currentCase.details,
    searchResults: state.ui.search.searchResults.rows,
    count: state.ui.search.searchResults.count,
    spinnerVisible: state.ui.search.spinnerVisible,
    newPage: state.ui.search.newPage,
    form: state.form
  };
};

export default connect(mapStateToProps)(AllegationSearchResults);
