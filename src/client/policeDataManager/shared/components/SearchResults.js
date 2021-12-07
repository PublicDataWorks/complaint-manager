import React, { Component } from "react";
import { CircularProgress, Paper, Typography } from "@material-ui/core";
import { DEFAULT_PAGINATION_LIMIT } from "../../../../sharedUtilities/constants";
import PropTypes from "prop-types";
import localeInfo from "rc-pagination/lib/locale/en_US";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "../../../common/globalStyling/pagination.css";

export class SearchResults extends Component {
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
        <Paper elevation={0}>
          {this.props.spinnerVisible ? (
            this.renderSpinner()
          ) : (
            <>
              {this.renderSearchResultsMessage(paginating)}
              {this.renderSearchResults()}
            </>
          )}
        </Paper>
        {paginating && !this.props.spinnerVisible && this.pagination()}
      </div>
    );
  }

  renderSpinner = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <CircularProgress
          data-testid="spinner"
          style={{ marginTop: "100px", marginBottom: "32px" }}
          size={80}
        />
      </div>
    );
  };

  renderSearchResultsMessage = paginating => {
    const {
      pagination,
      searchResultsLength,
      spinnerVisible,
      subtitleResultCount
    } = this.props;
    if (spinnerVisible) {
      return null;
    }
    let message = "";
    if (subtitleResultCount) {
      if (searchResultsLength === 1) {
        message = `1 result found`;
      } else {
        const amountOfResults = paginating
          ? pagination.count
          : searchResultsLength;
        message = `${amountOfResults || 0} results found`;
      }
    }

    return (
      <Typography
        variant="body2"
        data-testid={"searchResultsMessage"}
        style={{ marginBottom: "16px" }}
      >
        {message}
      </Typography>
    );
  };

  renderSearchResults = () => {
    if (this.props.searchResultsLength === 0) {
      return null;
    }
    return this.props.children;
  };
}
//NOTE: This does work, if you take it out some of the other tests fail.
SearchResults.defaultProps = {
  searchResultsLength: 0,
  subtitleResultCount: true
};

SearchResults.propTypes = {
  children: PropTypes.element,
  pagination: PropTypes.shape({
    count: PropTypes.number,
    currentPage: PropTypes.number,
    onChange: PropTypes.func,
    totalMessage: PropTypes.func
  }),
  searchResultsLength: PropTypes.number,
  spinnerVisible: PropTypes.bool,
  subtitleResultCount: PropTypes.bool
};

export default SearchResults;
