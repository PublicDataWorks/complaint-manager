import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Table, TableBody } from "@material-ui/core";
import "rc-pagination/assets/index.css";
import "../../common/globalStyling/pagination.css";
import AllegationSearchTableHeader from "./AllegationSearchTableHeader";
import AllegationSearchResultsRow from "./AllegationSearchResultsRow";
import SearchResults from "../shared/components/SearchResults";
import getSearchResults from "../shared/thunks/getSearchResults";
import { ALLEGATION_SEARCH_FORM_NAME } from "../../../sharedUtilities/constants";
import { searchCleared } from "../actionCreators/searchActionCreators";

export class AllegationSearchResults extends Component {
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
    const values = this.props.form[ALLEGATION_SEARCH_FORM_NAME].values;
    const paginatingSearch = true;

    this.props.dispatch(
      getSearchResults(
        this.normalizeValues(values),
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
          searchResultsLength={
            this.props.searchResults ? this.props.searchResults.length : 0
          }
          spinnerVisible={this.props.spinnerVisible}
        >
          <Table style={{ marginBottom: "32px" }}>
            <AllegationSearchTableHeader />
            <TableBody>
              {this.props.searchResults
                ? this.props.searchResults.map(allegation => (
                    <AllegationSearchResultsRow
                      key={allegation.id}
                      allegation={allegation}
                      caseId={this.props.caseId}
                      caseOfficerId={this.props.caseOfficerId}
                    />
                  ))
                : ""}
            </TableBody>
          </Table>
        </SearchResults>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    caseDetails: state.currentCase.details,
    searchResults: state.ui.search.searchResults.rows,
    count: state.ui.search.searchResults.count,
    spinnerVisible: state.ui.search.spinnerVisible,
    newPage: state.ui.search.newPage,
    form: state.form
  };
};

export default connect(mapStateToProps)(AllegationSearchResults);
