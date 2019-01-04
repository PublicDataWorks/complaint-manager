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
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/en_US";
import { connect } from "react-redux";
import { compose } from "redux";
import CaseRow from "./CaseRow";
import tableStyleGenerator from "../../tableStyles";
import { updateSort, updatePage } from "../../actionCreators/casesActionCreators";
import getCases from "../thunks/getCases";

class CasesTable extends React.Component {

  componentDidMount() {
    this.props.getCases(this.props.casesTable);
  }

  componentDidUpdate(prevProps) {
    if (this.props.casesTable !== prevProps.casesTable)
      this.props.getCases(this.props.casesTable);
  }

  render() {
    const {
      cases, count,
      classes, updateSort, updatePage,
      casesTable: { sortBy, sortDirection, page, pageSize }
    } = this.props;
    return (
      <div>
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
                    data-test="caseNumberSortLabel"
                    onClick={() => updateSort("id")}
                    direction={sortDirection}
                    active={sortBy === "id"}
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
                    onClick={() => updateSort("status")}
                    direction={sortDirection}
                    active={sortBy === "status"}
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
                    onClick={() => updateSort("complainant")}
                    direction={sortDirection}
                    active={sortBy === "complainant"}
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
                    data-test="accusedOfficerSortLabel"
                    onClick={() => updateSort("accusedOfficer")}
                    direction={sortDirection}
                    active={sortBy === "accusedOfficer"}
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
                    onClick={() => updateSort("firstContactDate")}
                    direction={sortDirection}
                    active={sortBy === "firstContactDate"}
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
                    onClick={() => updateSort("assignedTo")}
                    direction={sortDirection}
                    active={sortBy === "assignedTo"}
                  >
                    <Typography variant="body2">Assigned To</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: "14%" }} className={classes.cell} />
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.map(caseDetails =>
                <CaseRow
                  key={caseDetails.id}
                  caseDetails={caseDetails}
                  currentUser={this.props.currentUser}
                />
              )}
            </TableBody>
          </Table>
          <Pagination
            total={count}
            showTotal={() => `${count} total cases`}
            pageSize={pageSize}
            current={page + 1}
            onChange={page => updatePage(page - 1)}
            locale={localeInfo}
          />
        </Paper>
      </div>
    );
  }
}

const styles = theme => ({
  ...tableStyleGenerator(theme).header,
  ...tableStyleGenerator(theme).table
});

const mapStateToProps = state => ({
  cases: state.cases.all.cases,
  count: state.cases.all.count,
  currentUser: state.users.current.userInfo,
  casesTable: state.ui.casesTable
});


export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps, { getCases, updateSort, updatePage })
)(CasesTable);
