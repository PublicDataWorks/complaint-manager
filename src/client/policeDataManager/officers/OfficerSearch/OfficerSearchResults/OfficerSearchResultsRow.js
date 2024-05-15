import React from "react";
import tableStyleGenerator from "../../../../tableStyles";
import { TableCell, TableRow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  ...tableStyleGenerator(theme).body,
  active: {
    color: theme.palette.green
  },
  terminated: {
    color: theme.palette.red
  },
  deceased: {
    color: theme.palette.secondary.light
  },
  retired: {
    color: theme.palette.secondary.main
  },
  inactive: {
    color: theme.palette.yellow
  }
});

const getClassName = (classes, workStatus) => {
  if (workStatus === "" || workStatus == null) {
    return "";
  }
  return classes[workStatus.toLowerCase()];
};

const OfficerSearchResultsRow = ({ classes, officer, children }) => {
  const { workStatus = "" } = officer;

  return (
    <TableRow className={classes.row}>
      <TableCell className={classes.cell}>
        <div data-testid="officerFullName">{officer.fullName}</div>
        <div className={getClassName(classes, workStatus)}>{workStatus}</div>
      </TableCell>
      <TableCell className={classes.cell}>{officer.employeeId}</TableCell>
      <TableCell className={classes.cell}>{officer.rank}</TableCell>
      <TableCell className={classes.cell}>{officer.bureau}</TableCell>
      <TableCell className={classes.cell}>
        {officer.officerDistrict && officer.officerDistrict.name}
      </TableCell>
      <TableCell className={classes.cell}>{officer.sex}</TableCell>
      <TableCell className={classes.cell}>{officer.race}</TableCell>
      <TableCell className={classes.cell}>{officer.age}</TableCell>
      <TableCell className={classes.buttonCell}>{children}</TableCell>
    </TableRow>
  );
};

export default withStyles(styles, { withTheme: true })(OfficerSearchResultsRow);
