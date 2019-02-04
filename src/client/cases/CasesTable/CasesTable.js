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
import _ from "lodash";

const styles = theme => ({
  ...tableStyleGenerator(theme).header,
  ...tableStyleGenerator(theme).table
});

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

  renderCases(classes) {
    if (_.isEmpty(this.props.cases)) {
      return null;
    }

    return (
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
    );
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
                    onClick={() => this.props.dispatch(updateSort("lastName"))}
                    direction={this.props.sortDirection}
                    active={this.props.sortBy === "lastName"}
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

            {this.renderCases(classes)}
          </Table>
          {this.renderNoCasesMessage()}
        </Paper>
      </div>
    );
  }
}

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
  connect(mapStateToProps)(CasesTable)
);
