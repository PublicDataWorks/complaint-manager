import React from "react";
import {
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import tableStyleGenerator from "../../tableStyles";

const styles = theme => ({
  ...tableStyleGenerator(theme).header
});

const OfficerSearchTableHeader = props => {
  const { classes } = props;
  return (
    <TableHead>
      <TableRow className={classes.row}>
        <TableCell
          data-test="casesNumberHeader"
          className={classes.cell}
          style={{ width: "17%" }}
        >
          <Typography variant="body2">Name</Typography>
        </TableCell>
        <TableCell
          data-test="casesComplainantHeader"
          className={classes.cell}
          style={{ width: "17%" }}
        >
          <Typography variant="body2">Rank</Typography>
        </TableCell>
        <TableCell
          data-test="casesFirstContactDateHeader"
          className={classes.cell}
          style={{ width: "17%" }}
        >
          <Typography variant="body2">Bureau</Typography>
        </TableCell>
        <TableCell
          data-test="casesAssignedToHeader"
          className={classes.cell}
          style={{ width: "11%" }}
        >
          <Typography variant="body2">District</Typography>
        </TableCell>
        <TableCell
          data-test="casesAssignedToHeader"
          className={classes.cell}
          style={{ width: "10%" }}
        >
          <Typography variant="body2">Gender</Typography>
        </TableCell>
        <TableCell
          data-test="casesAssignedToHeader"
          className={classes.cell}
          style={{ width: "10%" }}
        >
          <Typography variant="body2">Race</Typography>
        </TableCell>
        <TableCell
          data-test="casesAssignedToHeader"
          className={classes.cell}
          style={{ width: "8%" }}
        >
          <Typography variant="body2">Age</Typography>
        </TableCell>
        <TableCell className={classes.cell} style={{ width: "10%" }} />
      </TableRow>
    </TableHead>
  );
};

export default withStyles(styles, { withTheme: true })(
  OfficerSearchTableHeader
);
