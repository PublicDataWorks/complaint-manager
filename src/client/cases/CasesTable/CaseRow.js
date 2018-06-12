import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import formatDate from "../../utilities/formatDate";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import tableStyleGenerator from "../../tableStyles";
import DisplayComplainant from "./DisplayComplainant";
import DisplayAccusedOfficer from "./DisplayAccusedOfficer";

const styles = theme => ({
  ...tableStyleGenerator(theme).body,
  buttonCell: {
    textAlign: "right"
  }
});

const CaseRow = ({ classes, caseDetails }) => (
  <TableRow data-test={`caseRow${caseDetails.id}`} className={classes.row}>
    <TableCell data-test="caseNumber" className={classes.cell}>
      {caseDetails.id}
    </TableCell>
    <TableCell data-test="caseStatus" className={classes.cell}>
      {caseDetails.status}
    </TableCell>
    <TableCell data-test="caseName" className={classes.cell}>
      <DisplayComplainant caseDetails={caseDetails} />
    </TableCell>
    <TableCell data-test="accusedOfficer" className={classes.cell}>
      <DisplayAccusedOfficer accusedOfficers={caseDetails.accusedOfficers} />
    </TableCell>
    <TableCell data-test="caseFirstContactDate" className={classes.cell}>
      {formatDate(caseDetails.firstContactDate)}
    </TableCell>
    <TableCell data-test="caseAssignedTo" className={classes.cell}>
      {caseDetails.assignedTo}
    </TableCell>
    <TableCell data-test="openCase" className={classes.buttonCell}>
      <LinkButton
        component={Link}
        to={`/cases/${caseDetails.id}`}
        data-test="openCaseButton"
      >
        Open Case
      </LinkButton>
    </TableCell>
  </TableRow>
);

export default withStyles(styles, { withTheme: true })(CaseRow);
