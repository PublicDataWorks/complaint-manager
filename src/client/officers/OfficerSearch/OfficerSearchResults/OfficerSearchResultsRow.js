import React from "react";
import tableStyleGenerator from "../../../tableStyles";
import { TableCell, TableRow, withStyles } from "material-ui";

const styles = theme => ({
  ...tableStyleGenerator(theme).body,
  buttonCell: {
    textAlign: "right"
  },
  active: {
    color: theme.palette.green
  },
  terminated: {
    color: theme.palette.red
  },
  deceased: {
    color: theme.palette.secondary.lighter
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
      <TableCell className={classes.cell} style={{ paddingLeft: "16px" }}>
        <div>{officer.fullName}</div>
        <div className={getClassName(classes, workStatus)}>{workStatus}</div>
      </TableCell>
      <TableCell className={classes.cell}>{officer.rank}</TableCell>
      <TableCell className={classes.cell}>{officer.bureau}</TableCell>
      <TableCell className={classes.cell}>{officer.district}</TableCell>
      <TableCell className={classes.cell}>{officer.sex}</TableCell>
      <TableCell className={classes.cell}>{officer.race}</TableCell>
      <TableCell className={classes.cell}>{officer.age}</TableCell>
      <TableCell className={classes.buttonCell}>{children}</TableCell>
    </TableRow>
  );
};

export default withStyles(styles, { withTheme: true })(OfficerSearchResultsRow);
