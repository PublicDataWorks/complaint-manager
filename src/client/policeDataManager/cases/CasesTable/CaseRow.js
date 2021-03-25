import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import formatDate from "../../../../sharedUtilities/formatDate";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import tableStyleGenerator from "../../../tableStyles";
import DisplayComplainant from "./DisplayComplainant";
import DisplayAccusedOfficer from "./DisplayAccusedOfficer";
import colors from "../../../common/globalStyling/colors";
import {
  CASE_STATUS,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import UserAvatar from "../UserAvatar";

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

const CaseRow = ({ classes, caseDetails, currentUser }) => {
  return (
    <TableRow data-testid={`caseRow${caseDetails.id}`} className={classes.row}>
      <TableCell data-testid="caseReference" className={classes.cell}>
        <div>{caseDetails.caseReference}</div>
      </TableCell>
      <TableCell data-testid="caseStatus" className={classes.cell}>
        {currentUser.permissions.includes(
          USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES
        )
          ? formatCaseStatusForDPM(caseDetails.status)
          : caseDetails.status}
      </TableCell>
      <TableCell data-testid="caseName" className={classes.cell}>
        <DisplayComplainant complainant={caseDetails.primaryComplainant} />
      </TableCell>
      <TableCell data-testid="primaryAccusedOfficer" className={classes.cell}>
        <DisplayAccusedOfficer
          primaryAccusedOfficer={caseDetails.primaryAccusedOfficer}
        />
      </TableCell>
      <TableCell data-testid="caseFirstContactDate" className={classes.cell}>
        <div>{formatDate(caseDetails.firstContactDate)}</div>
      </TableCell>
      <TableCell data-testid="caseAssignedTo" className={classes.cell}>
        <UserAvatar email={caseDetails.assignedTo} />
      </TableCell>
      <TableCell data-testid="openCase" className={classes.buttonCell}>
        <LinkButton
          component={Link}
          to={`/cases/${caseDetails.id}`}
          data-testid="openCaseButton"
        >
          Open Case
        </LinkButton>
      </TableCell>
    </TableRow>
  );
};

export default withStyles(styles, { withTheme: true })(CaseRow);
