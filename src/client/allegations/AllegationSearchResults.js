import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/en_US";
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
    this.state = {
      currentPage: 1
    };
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

    this.setState({ currentPage });
    const normalizedValues = {
      ...normalizeValues(values),
      offset: offset,
      limit: DEFAULT_PAGINATION_LIMIT
    };
    const paginatingSearch = true;

    this.props.dispatch(
      getSearchResults(normalizedValues, "allegations", paginatingSearch)
    );
  }

  pagination() {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          showTotal={total => `Total ${total} allegations`}
          total={this.props.count}
          pageSize={20}
          onChange={this.onChange}
          defaultCurrent={1}
          defaultPageSize={20}
          locale={localeInfo}
          current={this.state.currentPage}
          hideOnSinglePage={true}
        />
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        {this.pagination()}
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
        {this.pagination()}
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
    form: state.form
  };
};

export default connect(mapStateToProps)(AllegationSearchResults);
