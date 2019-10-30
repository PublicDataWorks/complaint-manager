import React, { Component } from "react";
import { Paper, Table, TableBody, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import tableStyleGenerator from "../../../../tableStyles";
import CaseHistoryTableHeader from "./CaseHistoryTableHeader";
import { connect } from "react-redux";
import CaseHistoryRow from "./CaseHistoryTableRow";

const styles = theme => ({
  ...tableStyleGenerator(theme).table
});

class CaseHistoryTable extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="title" className={classes.labelMargin}>
          Case History
        </Typography>
        <Typography
          variant="body1"
          className={classes.labelMargin}
          style={{ marginBottom: "16px" }}
        >
          Below you will find the full case history, including all automatically
          captured actions since the case's creation.
        </Typography>
        <Paper elevation={0} className={classes.tableMargin}>
          <Table>
            <CaseHistoryTableHeader />
            <TableBody>{this.renderCaseHistoryRows()}</TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  renderCaseHistoryRows() {
    if (!this.props.caseHistory) {
      return null;
    }
    return this.props.caseHistory.map(history => {
      return <CaseHistoryRow history={history} key={history.id} />;
    });
  }
}

const mapStateToProps = state => ({
  caseHistory: state.currentCase.caseHistory
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(CaseHistoryTable)
);
