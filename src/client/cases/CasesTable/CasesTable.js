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
import sortBy from "../../utilities/sortBy";

const styles = theme => ({
  ...tableStyleGenerator(theme).header,
  ...tableStyleGenerator(theme).table
});

class CasesTable extends React.Component {
  render() {
    const { classes } = this.props;
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
                    data-test="caseReferenceSortLabel"
                    onClick={() =>
                      this.props.dispatch(updateSort("caseReference"))
                    }
                    direction={this.props.sortDirection}
                    active={this.props.sortBy === "caseReference"}
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
                    onClick={() => this.props.dispatch(updateSort("status"))}
                    direction={this.props.sortDirection}
                    active={this.props.sortBy === "status"}
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
                    onClick={() => this.props.dispatch(updateSort("primaryComplainant"))}
                    direction={this.props.sortDirection}
                    active={this.props.sortBy === "primaryComplainant"}
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
                    onClick={() =>
                      this.props.dispatch(updateSort("accusedOfficer"))
                    }
                    direction={this.props.sortDirection}
                    active={this.props.sortBy === "accusedOfficer"}
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
                      this.props.dispatch(updateSort("firstContactDate"))
                    }
                    direction={this.props.sortDirection}
                    active={this.props.sortBy === "firstContactDate"}
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
                      this.props.dispatch(updateSort("assignedTo"))
                    }
                    direction={this.props.sortDirection}
                    active={this.props.sortBy === "assignedTo"}
                  >
                    <Typography variant="body2">Assigned To</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: "14%" }} className={classes.cell} />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortBy(
                this.props.cases,
                this.props.sortBy,
                this.props.sortDirection
              ).map(caseDetails => (
                <CaseRow
                  key={caseDetails.id}
                  caseDetails={caseDetails}
                  currentUser={this.props.currentUser}
                />
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cases: state.cases.all,
  currentUser: state.users.current.userInfo,
  caseCreationSuccess: state.ui.snackbar.success,
  sortBy: state.ui.casesTable.sortBy,
  sortDirection: state.ui.casesTable.sortDirection
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CasesTable)
);
