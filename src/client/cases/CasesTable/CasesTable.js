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
import tableStyleGenerator from "../../tableStyles";
import { updateSort } from "../../actionCreators/casesActionCreators";
import _ from "lodash";
import getArchivedCases from "../thunks/getArchivedCases";
import getCases from "../thunks/getCases";
import {
  ASCENDING,
  DESCENDING,
  SORT_CASES_BY
} from "../../../sharedUtilities/constants";
import SearchResults from "../../shared/components/SearchResults";

const styles = theme => ({
  ...tableStyleGenerator(theme).header,
  ...tableStyleGenerator(theme).table
});

const toggleDirection = direction => {
  if (direction === DESCENDING) {
    return ASCENDING;
  }
  return DESCENDING;
};

class CasesTable extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  updateSort(sortBy, sortDirection) {
    this.props.dispatch(updateSort(sortBy, sortDirection));
  }
  getCases(sortBy, sortDirection, page) {
    this.props.archived
      ? this.props.dispatch(getArchivedCases(sortBy, sortDirection, page))
      : this.props.dispatch(getCases(sortBy, sortDirection, page));
  }

  renderNoCasesMessage() {
    return `There are no ${
      this.props.archived ? "archived " : ""
    }cases to view.`;
  }

  componentDidMount() {
    this.getCases(SORT_CASES_BY.CASE_REFERENCE, DESCENDING, 1);
    this.updateSort(SORT_CASES_BY.CASE_REFERENCE, DESCENDING);
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
    this.getCases(this.props.sortBy, this.props.sortDirection, currentPage);
  }

  render() {
    if (!this.props.loaded) {
      return null;
    }

    const { classes } = this.props;
    return (
      <div style={{ marginTop: "24px" }} className={classes.tableMargin}>
        <SearchResults
          pagination={{
            onChange: this.onChange,
            totalMessage: total => `${total} results found`,
            count: this.props.totalCaseCount,
            currentPage: this.props.currentPage
          }}
          header={"Results"}
          subtitleResultCount={false}
          searchResults={this.props.cases}
          noResultsMessage={this.renderNoCasesMessage()}
          spinnerVisible={!this.props.loaded}
          tableHeaderComponent={
            <Fragment>
              <TableHead>
                <TableRow className={classes.row}>
                  <TableCell
                    data-test="casesNumberHeader"
                    style={{ width: "10%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-test="caseReferenceSortLabel"
                      onClick={() =>
                        this.updateSorting(SORT_CASES_BY.CASE_REFERENCE)
                      }
                      direction={this.props.sortDirection}
                      active={
                        this.props.sortBy === SORT_CASES_BY.CASE_REFERENCE
                      }
                    >
                      <Typography variant="body2">Case #</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-test="casesStatusHeader"
                    style={{ width: "13%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-test="statusSortLabel"
                      onClick={() => this.updateSorting(SORT_CASES_BY.STATUS)}
                      direction={this.props.sortDirection}
                      active={this.props.sortBy === SORT_CASES_BY.STATUS}
                    >
                      <Typography variant="body2">Status</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-test="casesComplainantHeader"
                    style={{ width: "16%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-test="complainantSortLabel"
                      onClick={() =>
                        this.updateSorting(SORT_CASES_BY.PRIMARY_COMPLAINANT)
                      }
                      direction={this.props.sortDirection}
                      active={
                        this.props.sortBy === SORT_CASES_BY.PRIMARY_COMPLAINANT
                      }
                    >
                      <Typography variant="body2">Complainant</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-test="casesAccusedOfficerHeader"
                    style={{ width: "16%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-test="primaryAccusedOfficerSortLabel"
                      onClick={() =>
                        this.updateSorting(
                          SORT_CASES_BY.PRIMARY_ACCUSED_OFFICER
                        )
                      }
                      direction={this.props.sortDirection}
                      active={
                        this.props.sortBy ===
                        SORT_CASES_BY.PRIMARY_ACCUSED_OFFICER
                      }
                    >
                      <Typography variant="body2">Accused Officer</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-test="casesFirstContactDateHeader"
                    style={{ width: "15%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-test="firstContactDateSortLabel"
                      onClick={() =>
                        this.updateSorting(SORT_CASES_BY.FIRST_CONTACT_DATE)
                      }
                      direction={this.props.sortDirection}
                      active={
                        this.props.sortBy === SORT_CASES_BY.FIRST_CONTACT_DATE
                      }
                    >
                      <Typography variant="body2">First Contact</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    data-test="casesAssignedToHeader"
                    style={{ width: "14%" }}
                    className={classes.cell}
                  >
                    <TableSortLabel
                      data-test="casesAssignedToSortLabel"
                      onClick={() =>
                        this.updateSorting(SORT_CASES_BY.ASSIGNED_TO)
                      }
                      direction={this.props.sortDirection}
                      active={this.props.sortBy === SORT_CASES_BY.ASSIGNED_TO}
                    >
                      <Typography variant="body2">Assigned To</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{ width: "14%" }}
                    className={classes.cell}
                  />
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

const mapStateToProps = (state, ownProps) => ({
  cases: ownProps.archived
    ? state.cases.archived.cases
    : state.cases.working.cases,
  totalCaseCount: ownProps.archived
    ? state.cases.archived.totalCaseCount
    : state.cases.working.totalCaseCount,
  loaded: ownProps.archived
    ? state.cases.archived.loaded
    : state.cases.working.loaded,
  currentUser: state.users.current.userInfo,
  sortBy: state.ui.casesTable.sortBy,
  sortDirection: state.ui.casesTable.sortDirection
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CasesTable)
);
