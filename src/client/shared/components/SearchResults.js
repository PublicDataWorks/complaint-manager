import React, { Component } from "react";
import {
  LinearProgress,
  Paper,
  Table,
  TableBody,
  Typography
} from "@material-ui/core";
import { searchCleared } from "../../actionCreators/searchActionCreators";
import { DEFAULT_PAGINATION_LIMIT } from "../../../sharedUtilities/constants";
import localeInfo from "rc-pagination/lib/locale/en_US";
import Pagination from "rc-pagination";

export class SearchResults extends Component {
  componentWillUnmount() {
    this.props.dispatch(searchCleared());
  }

  pagination() {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          showTotal={this.props.pagination.totalMessage}
          total={this.props.pagination.count}
          pageSize={DEFAULT_PAGINATION_LIMIT}
          onChange={this.props.pagination.onChange}
          defaultCurrent={1}
          defaultPageSize={DEFAULT_PAGINATION_LIMIT}
          locale={localeInfo}
          current={this.props.pagination.currentPage}
          hideOnSinglePage={true}
        />
      </div>
    );
  }

  render() {
    const paginating = this.props.pagination != null;
    return (
      <div>
        <Typography variant="title" data-test={"searchHeader"}>
          {this.renderHeader(this.props.header)}
        </Typography>
        <Paper elevation={0}>
          {this.renderSearchResultsMessage(paginating)}
          {this.renderSearchResults()}
          {this.renderSpinner()}
        </Paper>
        {paginating && this.pagination()}
      </div>
    );
  }

  renderHeader = header => {
    return header ? header : "Search Results";
  };

  renderSpinner = () => {
    if (!this.props.spinnerVisible) {
      return null;
    }
    return (
      <div style={{ textAlign: "center" }}>
        <LinearProgress
          data-test="spinner"
          style={{ marginTop: "24px", marginBottom: "32px" }}
          size={300}
        />
      </div>
    );
  };

  renderSearchResultsMessage = paginating => {
    if (this.props.spinnerVisible) {
      return null;
    }
    let message = "";
    const searchResultsLength =
      this.props.searchResults && this.props.searchResults.length;
    if (!this.props.searchResults || searchResultsLength === 0) {
      message = this.props.noResultsMessage
        ? this.props.noResultsMessage
        : "No results found";
    } else if (this.props.subtitleResultCount) {
      if (searchResultsLength === 1) {
        message = `1 result found`;
      } else {
        const amountOfResults = paginating
          ? this.props.pagination.count
          : searchResultsLength;
        message = `${amountOfResults} results found`;
      }
    }

    return (
      <Typography
        variant="body1"
        data-test={"searchResultsMessage"}
        style={{ marginBottom: "16px" }}
      >
        {message}
      </Typography>
    );
  };

  renderSearchResults = () => {
    if (!this.props.searchResults || this.props.searchResults.length === 0) {
      return null;
    }
    return (
      <Table style={{ marginBottom: "32px" }}>
        {this.props.tableHeaderComponent}
        <TableBody>{this.generateResultsRows()}</TableBody>
      </Table>
    );
  };

  generateResultsRows() {
    const { searchResults, searchResultsIds } = this.props;

    return searchResults.map(searchResult =>
      this.props.render(searchResult, searchResultsIds)
    );
  }
}
//NOTE: This does work, if you take it out some of the other tests fail.
SearchResults.defaultProps = {
  subtitleResultCount: true
};

export default SearchResults;
