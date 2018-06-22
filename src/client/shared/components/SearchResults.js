import React, { Component } from "react";
import {
  Paper,
  Table,
  TableBody,
  Typography,
  LinearProgress
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
    const resultsFitOnSinglePage =
      paginating && this.props.pagination.count <= DEFAULT_PAGINATION_LIMIT;
    const shouldShowResultCount = !paginating || resultsFitOnSinglePage;
    return (
      <div>
        <Typography variant="title">Search Results</Typography>
        {paginating && this.pagination()}
        <Paper elevation={0}>
          {shouldShowResultCount && this.renderSearchResultsMessage()}
          {this.renderSearchResults()}
          {this.renderSpinner()}
        </Paper>
        {paginating && this.pagination()}
      </div>
    );
  }

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

  renderSearchResultsMessage = () => {
    if (this.props.spinnerVisible) {
      return null;
    }
    let message = "";
    if (!this.props.searchResults || this.props.searchResults.length === 0) {
      message = "No results found";
    } else if (this.props.searchResults.length === 1) {
      message = `1 result found`;
    } else {
      message = `${this.props.searchResults.length} results found`;
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

export default SearchResults;
