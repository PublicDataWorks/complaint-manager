import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import CaseRow from "./CaseRow";
import getSearchCases from "../thunks/getSearchCases";
import tableStyleGenerator from "../../../tableStyles";
import { updateSort } from "../../actionCreators/casesActionCreators";
import _ from "lodash";
import getArchivedCases from "../thunks/getArchivedCases";
import getWorkingCases from "../thunks/getWorkingCases";
import {
  ASCENDING,
  ARCHIVE,
  DESCENDING,
  SORT_CASES_BY,
  WORKING,
  SEARCH
} from "../../../../sharedUtilities/constants";
import SearchResults from "../../shared/components/SearchResults";
import logger from "../../../logger";
import axios from "axios";
import {
  searchSuccess,
  searchFailed
} from "../../actionCreators/searchActionCreators";

const styles = theme => ({
  ...tableStyleGenerator(theme).header,
  ...tableStyleGenerator(theme).table
});

const toggleDirection = direction =>
  direction === DESCENDING ? ASCENDING : DESCENDING;

class CasesTable extends React.Component {
  constructor(props) {
    super(props);
    this.currentPage = this.props.currentPage || 1;
    this.onChange = this.onChange.bind(this);
  }

  updateSort(sortBy, sortDirection) {
    this.props.dispatch(updateSort(sortBy, sortDirection));
  }

  getQueryString() {
    // Get currentPage from here, if necessary.
    const rawParams = decodeURIComponent(location.search);
    const [queryString] = rawParams.split(/(?:&|\?)[^=]+=/).slice(1);
    return queryString;
  }

  getCases(sortBy, sortDirection, page) {
    switch (this.props.caseType) {
      case ARCHIVE:
        this.props.dispatch(getArchivedCases(sortBy, sortDirection, page));
        break;
      case WORKING:
        this.props.dispatch(getWorkingCases(sortBy, sortDirection, page));
        break;
      case SEARCH:
        const queryString = this.getQueryString();
        if (!queryString) {
          console.warn("No queryString param provided while searching.");
          this.props.dispatch(searchFailed());
          return;
        }
        this.props.dispatch(
          getSearchCases(queryString, sortBy, sortDirection, page)
        );
        break;
    }
  }

  renderNoCasesMessage() {
    return this.props.noCasesMessage;
  }

  getPagination() {
    return {
      onChange: this.onChange,
      totalMessage: total => `${total} results found`,
      count: this.props.totalCaseCount,
      currentPage: this.currentPage
    };
  }

  componentDidMount() {
    this.getCases(SORT_CASES_BY.CASE_REFERENCE, DESCENDING, 1);
    this.updateSort(SORT_CASES_BY.CASE_REFERENCE, DESCENDING);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.getCases(
        this.props.sortBy,
        this.props.sortDirection,
        this.currentPage
      );
    }
  }

  renderCases(classes) {
    if (_.isEmpty(this.props.cases)) {
      return null;
    }

    return (
      <TableBody>
        {this.props.cases.map(caseDetails => (
          <CaseRow
            key={caseDetails.id}
            caseDetails={caseDetails}
            currentUser={this.props.currentUser}
          />
        ))}
      </TableBody>
    );
  }

  updateSorting(newSortBy) {
    let newSortDirection;
    if (this.props.sortBy === newSortBy) {
      newSortDirection = toggleDirection(this.props.sortDirection);
    } else {
      newSortDirection = ASCENDING;
    }
    this.getCases(newSortBy, newSortDirection, 1);
    this.updateSort(newSortBy, newSortDirection);
  }

  onChange(currentPage) {
    this.currentPage = currentPage;
    this.getCases(
      this.props.sortBy,
      this.props.sortDirection,
      this.currentPage
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ marginTop: "24px" }} className={classes.tableMargin}>
        <SearchResults
          pagination={this.getPagination()}
          subtitleResultCount={false}
          searchResults={this.props.cases}
          noResultsMessage={this.renderNoCasesMessage()}
          spinnerVisible={!this.props.loaded}
          tableHeaderComponent={
            <Fragment>
              <TableHead>
                <TableRow className={classes.row}>
                  <TableCell
                    data-testid="casesNumberHeader"
                    style={{ width: "10%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-testid="caseReferenceSortLabel"
                      onClick={() =>
                        this.updateSorting(SORT_CASES_BY.CASE_REFERENCE)
                      }
                      direction={this.props.sortDirection}
                      active={
                        this.props.sortBy === SORT_CASES_BY.CASE_REFERENCE
                      }
                    >
                      <Typography variant="subtitle2">Case #</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-testid="casesComplainantHeader"
                    style={{ width: "16%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-testid="complainantSortLabel"
                      onClick={() =>
                        this.updateSorting(SORT_CASES_BY.PRIMARY_COMPLAINANT)
                      }
                      direction={this.props.sortDirection}
                      active={
                        this.props.sortBy === SORT_CASES_BY.PRIMARY_COMPLAINANT
                      }
                    >
                      <Typography variant="subtitle2">Complainant</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-testid="casesAccusedOfficerHeader"
                    style={{ width: "18%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-testid="primaryAccusedOfficerSortLabel"
                      onClick={() =>
                        this.updateSorting(SORT_CASES_BY.ACCUSED_OFFICERS)
                      }
                      direction={this.props.sortDirection}
                      active={
                        this.props.sortBy === SORT_CASES_BY.ACCUSED_OFFICERS
                      }
                    >
                      <Typography variant="subtitle2">Accused</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-testid="casesFirstContactDateHeader"
                    style={{ width: "15%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-testid="firstContactDateSortLabel"
                      onClick={() =>
                        this.updateSorting(SORT_CASES_BY.FIRST_CONTACT_DATE)
                      }
                      direction={this.props.sortDirection}
                      active={
                        this.props.sortBy === SORT_CASES_BY.FIRST_CONTACT_DATE
                      }
                    >
                      <Typography variant="subtitle2">First Contact</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-testid="casesTagsHeader"
                    style={{ width: "15%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-testid="tagsSortLabel"
                      onClick={() => this.updateSorting(SORT_CASES_BY.TAGS)}
                      direction={this.props.sortDirection}
                      active={this.props.sortBy === SORT_CASES_BY.TAGS}
                    >
                      <Typography variant="subtitle2">Tags</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-testid="casesStatusHeader"
                    style={{ width: "13%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-testid="statusSortLabel"
                      onClick={() => this.updateSorting(SORT_CASES_BY.STATUS)}
                      direction={this.props.sortDirection}
                      active={this.props.sortBy === SORT_CASES_BY.STATUS}
                    >
                      <Typography variant="subtitle2">Status</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-testid="casesAssignedToHeader"
                    style={{ width: "13%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-testid="casesAssignedToSortLabel"
                      onClick={() =>
                        this.updateSorting(SORT_CASES_BY.ASSIGNED_TO)
                      }
                      direction={this.props.sortDirection}
                      active={this.props.sortBy === SORT_CASES_BY.ASSIGNED_TO}
                    >
                      <Typography variant="subtitle2">Assigned To</Typography>
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Fragment>
          }
          dispatch={this.props.dispatch}
          render={caseDetails => (
            <CaseRow
              key={caseDetails.id}
              caseDetails={caseDetails}
              currentUser={this.props.currentUser}
              dispatch={this.props.dispatch}
            />
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, { caseType }) => {
  let currentUser = state.users.current.userInfo;
  let { sortBy, sortDirection } = state.ui.casesTable;
  let { cases, totalCaseCount, loaded } = state.cases[caseType];
  let searchQuery = state.router.location.search
    .substring(1)
    .split("&")
    .find(s => s.startsWith("queryString"));

  return {
    cases,
    totalCaseCount,
    loaded,
    currentUser,
    sortBy,
    sortDirection,
    searchQuery
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CasesTable)
);
