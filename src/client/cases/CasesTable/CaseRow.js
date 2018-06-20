import React from "react";
import { TableCell, TableRow, div } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import formatDate from "../../utilities/formatDate";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import tableStyleGenerator from "../../tableStyles";
import DisplayComplainant from "./DisplayComplainant";
import DisplayAccusedOfficer from "./DisplayAccusedOfficer";
import colors from "../../globalStyling/colors";
import {CASE_STATUS, USER_ROLES} from "../../../sharedUtilities/constants";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

const formatCaseStatusForDPM = status => {
  return status === CASE_STATUS.READY_FOR_REVIEW ? (
    <div style={{ fontWeight: 700, color: colors.green }}>{status}</div>
  ) : (
    <div>{status}</div>
  );
};

const CaseRow = ({ classes, caseDetails, currentUser }) => (
  <TableRow data-test={`caseRow${caseDetails.id}`} className={classes.row}>
    <TableCell data-test="caseNumber" className={classes.cell}>
      <div>{caseDetails.id}</div>
    </TableCell>
    <TableCell data-test="caseStatus" className={classes.cell}>
      {currentUser.roles.includes(USER_ROLES.DEPUTY_POLICE_MONITOR)
        ? formatCaseStatusForDPM(caseDetails.status)
        : caseDetails.status}
    </TableCell>
    <TableCell data-test="caseName" className={classes.cell}>
      <DisplayComplainant caseDetails={caseDetails} />
    </TableCell>
    <TableCell data-test="accusedOfficer" className={classes.cell}>
      <DisplayAccusedOfficer accusedOfficers={caseDetails.accusedOfficers} />
    </TableCell>
    <TableCell data-test="caseFirstContactDate" className={classes.cell}>
      <div>{formatDate(caseDetails.firstContactDate)}</div>
    </TableCell>
    <TableCell data-test="caseAssignedTo" className={classes.cell}>
      <div>{caseDetails.assignedTo}</div>
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
