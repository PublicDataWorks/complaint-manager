import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Table,
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
  renderNoCasesMessage() {
    if (_.isEmpty(this.props.cases)) {
      return (
        <div style={{ marginTop: "24px" }} data-test="no-cases-message">
          <i>{`There are no ${
            this.props.archived ? "archived " : ""
          }cases to view.`}</i>
        </div>
      );
    }
  }

  componentDidMount() {
    this.props.getCases(SORT_CASES_BY.CASE_REFERENCE, DESCENDING);
    this.props.updateSort(SORT_CASES_BY.CASE_REFERENCE, DESCENDING);
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
    this.props.getCases(newSortBy, newSortDirection);
    this.props.updateSort(newSortBy, newSortDirection);
  }

  render() {
    if (!this.props.loaded) {
      return null;
    }

    const { classes } = this.props;
    return (
      <div style={{ marginTop: "24px" }}>
        <Typography variant="title" className={classes.labelMargin}>
          Results
        </Typography>
        <Paper elevation={0} className={classes.tableMargin}>
          <Table data-test="allCasesTable">
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
                    active={this.props.sortBy === SORT_CASES_BY.CASE_REFERENCE}
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
                      this.updateSorting(SORT_CASES_BY.PRIMARY_ACCUSED_OFFICER)
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
                <TableCell style={{ width: "14%" }} className={classes.cell} />
              </TableRow>
            </TableHead>

            {this.renderCases(classes)}
          </Table>
          {this.renderNoCasesMessage()}
        </Paper>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateSort: (sortBy, sortDirection) =>
    dispatch(updateSort(sortBy, sortDirection)),
  getCases: (sortBy, sortDirection) =>
    ownProps.archived
      ? dispatch(getArchivedCases(sortBy, sortDirection))
      : dispatch(getCases(sortBy, sortDirection))
});

const mapStateToProps = (state, ownProps) => ({
  cases: ownProps.archived
    ? state.cases.archived.cases
    : state.cases.working.cases,
  loaded: ownProps.archived
    ? state.cases.archived.loaded
    : state.cases.working.loaded,
  currentUser: state.users.current.userInfo,
  sortBy: state.ui.casesTable.sortBy,
  sortDirection: state.ui.casesTable.sortDirection
});

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CasesTable)
);
