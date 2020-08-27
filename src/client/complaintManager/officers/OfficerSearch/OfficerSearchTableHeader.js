import React from "react";
import { TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import tableStyleGenerator from "../../../tableStyles";

const styles = theme => ({
  ...tableStyleGenerator(theme).header
});

const OfficerSearchTableHeader = props => {
  const { classes } = props;
  return (
    <TableHead>
      <TableRow className={classes.row}>
        <TableCell
          data-testid="casesNumberHeader"
          className={classes.cell}
          style={{ width: "17%" }}
        >
          <Typography variant="subtitle2">Name</Typography>
        </TableCell>
        <TableCell
          data-testid="casesNumberHeader"
          className={classes.cell}
          style={{ width: "17%" }}
        >
          <Typography variant="subtitle2">Badge #</Typography>
        </TableCell>
        <TableCell
          data-testid="casesComplainantHeader"
          className={classes.cell}
          style={{ width: "17%" }}
        >
          <Typography variant="subtitle2">Rank</Typography>
        </TableCell>
        <TableCell
          data-testid="casesFirstContactDateHeader"
          className={classes.cell}
          style={{ width: "17%" }}
        >
          <Typography variant="subtitle2">Bureau</Typography>
        </TableCell>
        <TableCell
          data-testid="casesAssignedToHeader"
          className={classes.cell}
          style={{ width: "11%" }}
        >
          <Typography variant="subtitle2">District</Typography>
        </TableCell>
        <TableCell
          data-testid="casesAssignedToHeader"
          className={classes.cell}
          style={{ width: "8%" }}
        >
          <Typography variant="subtitle2">Gender</Typography>
        </TableCell>
        <TableCell
          data-testid="casesAssignedToHeader"
          className={classes.cell}
          style={{ width: "14%" }}
        >
          <Typography variant="subtitle2">Race</Typography>
        </TableCell>
        <TableCell
          data-testid="casesAssignedToHeader"
          className={classes.cell}
          style={{ width: "6%" }}
        >
          <Typography variant="subtitle2">Age</Typography>
        </TableCell>
        <TableCell className={classes.cell} style={{ width: "10%" }} />
      </TableRow>
    </TableHead>
  );
};

export default withStyles(styles, { withTheme: true })(
  OfficerSearchTableHeader
);
