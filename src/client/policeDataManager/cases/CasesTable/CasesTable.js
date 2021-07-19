import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
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
import {
  searchCleared,
  searchFailed
} from "../../actionCreators/searchActionCreators";
import CasesTableHeaderCell from "./CasesTableHeaderCell";

const styles = theme => ({
  ...tableStyleGenerator(theme).header,
  ...tableStyleGenerator(theme).table
});

const toggleDirection = direction =>
  direction === DESCENDING ? ASCENDING : DESCENDING;

export const validateQuotes = value => {
  const ERROR_MSG = "Invalid search, Please try again";
  if (!value) {
    return;
  }

  let chunks = value.split('"');
  if (chunks.length % 2 === 0) {
    return ERROR_MSG;
  }

  for (let i = 1; i < chunks.length; i += 2) {
    if (chunks[i].trim() === "") {
      return ERROR_MSG;
    }
  }
};

class CasesTable extends React.Component {
  constructor(props) {
    super(props);
    this.currentPage = this.props.currentPage || 1;
    this.onChange = this.onChange.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(searchCleared());
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
        } else if (validateQuotes(queryString)) {
          console.warn("Invalid use of quotation marks in queryString");
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
    const { cases, classes, errorMsg, loaded, noCasesMessage } = this.props;
    return (
      <div style={{ marginTop: "24px" }} className={classes.tableMargin}>
        {errorMsg || (loaded && !cases.length) ? (
          <Typography
            variant="body2"
            data-testid={"searchResultsMessage"}
            style={{ marginBottom: "16px" }}
          >
            {errorMsg || noCasesMessage}
          </Typography>
        ) : (
          <SearchResults
            pagination={this.getPagination()}
            subtitleResultCount={false}
            spinnerVisible={!this.props.loaded}
            searchResultsLength={this.props.cases ? this.props.cases.length : 0}
          >
            <Table style={{ marginBottom: "32px" }}>
              {this.renderTableHeader()}
              <TableBody>
                {this.props.cases
                  ? this.props.cases.map(caseDetails => (
                      <CaseRow
                        key={caseDetails.id}
                        caseDetails={caseDetails}
                        currentUser={this.props.currentUser}
                        dispatch={this.props.dispatch}
                      />
                    ))
                  : ""}
              </TableBody>
            </Table>
          </SearchResults>
        )}
      </div>
    );
  }

  renderTableHeader() {
    const { classes, sortBy, sortDirection } = this.props;
    return (
      <TableHead>
        <TableRow className={classes.row}>
          <CasesTableHeaderCell
            active={sortBy === SORT_CASES_BY.CASE_REFERENCE}
            className={classes.cell}
            onClick={() => this.updateSorting(SORT_CASES_BY.CASE_REFERENCE)}
            sortDirection={sortDirection}
            testId="caseReference"
            width="10%"
          >
            Case #
          </CasesTableHeaderCell>
          <CasesTableHeaderCell
            active={sortBy === SORT_CASES_BY.PRIMARY_COMPLAINANT}
            className={classes.cell}
            onClick={() =>
              this.updateSorting(SORT_CASES_BY.PRIMARY_COMPLAINANT)
            }
            sortDirection={sortDirection}
            testId="complainant"
            width="16%"
          >
            Complainant
          </CasesTableHeaderCell>
          <CasesTableHeaderCell
            active={sortBy === SORT_CASES_BY.ACCUSED_OFFICERS}
            className={classes.cell}
            onClick={() => this.updateSorting(SORT_CASES_BY.ACCUSED_OFFICERS)}
            sortDirection={sortDirection}
            testId="accusedOfficers"
            width="18%"
          >
            Accused
          </CasesTableHeaderCell>
          <CasesTableHeaderCell
            active={sortBy === SORT_CASES_BY.FIRST_CONTACT_DATE}
            className={classes.cell}
            onClick={() => this.updateSorting(SORT_CASES_BY.FIRST_CONTACT_DATE)}
            sortDirection={sortDirection}
            testId="firstContactDate"
            width="15%"
          >
            First Contact
          </CasesTableHeaderCell>
          <CasesTableHeaderCell
            active={sortBy === SORT_CASES_BY.TAGS}
            className={classes.cell}
            onClick={() => this.updateSorting(SORT_CASES_BY.TAGS)}
            sortDirection={sortDirection}
            testId="tags"
            width="15%"
          >
            Tags
          </CasesTableHeaderCell>
          <CasesTableHeaderCell
            active={sortBy === SORT_CASES_BY.STATUS}
            className={classes.cell}
            onClick={() => this.updateSorting(SORT_CASES_BY.STATUS)}
            sortDirection={sortDirection}
            testId="status"
            width="13%"
          >
            Status
          </CasesTableHeaderCell>
          <CasesTableHeaderCell
            active={sortBy === SORT_CASES_BY.ASSIGNED_TO}
            className={classes.cell}
            onClick={() => this.updateSorting(SORT_CASES_BY.ASSIGNED_TO)}
            sortDirection={sortDirection}
            testId="casesAssignedTo"
            width="13%"
          >
            Assigned To
          </CasesTableHeaderCell>
        </TableRow>
      </TableHead>
    );
  }
}

const mapStateToProps = (state, { caseType }) => {
  let currentUser = state.users.current.userInfo;
  let { sortBy, sortDirection } = state.ui.casesTable;
  let { cases, totalCaseCount, loaded, errorMsg } = state.cases[caseType];
  let searchQuery = state.router.location.search
    .substring(1)
    .split("&")
    .find(s => s.startsWith("queryString"));

  return {
    cases,
    errorMsg,
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
