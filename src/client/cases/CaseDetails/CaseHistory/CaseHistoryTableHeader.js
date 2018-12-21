import tableStyleGenerator from "../../../tableStyles";
import { TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const styles = theme => tableStyleGenerator(theme).header;

const CaseHistoryTableHeader = ({ classes }) => {
  return (
    <TableHead>
      <TableRow className={classes.row}>
        <TableCell style={{ width: "10%" }} className={classes.cell}>
          <Typography variant="body2">User</Typography>
        </TableCell>
        <TableCell style={{ width: "10%" }} className={classes.cell}>
          <Typography variant="body2">Action</Typography>
        </TableCell>
        <TableCell style={{ width: "60%" }} className={classes.cell}>
          <Typography variant="body2">Details</Typography>
        </TableCell>
        <TableCell style={{ width: "20%" }} className={classes.cell}>
          <Typography variant="body2">Timestamp</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default withStyles(styles, { withTheme: true })(CaseHistoryTableHeader);
