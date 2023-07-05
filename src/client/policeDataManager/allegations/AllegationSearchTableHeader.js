import React from "react";
import { TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import tableStyleGenerator from "../../tableStyles";

const styles = theme => ({
  ...tableStyleGenerator(theme).header
});

const AllegationSearchTableHeader = props => {
  const { classes } = props;
  return (
    <TableHead>
      <TableRow className={classes.row}>
        <TableCell
          data-testid="allegationsRuleHeader"
          className={classes.cell}
          style={{ width: "20%" }}
        >
          <Typography variant="subtitle2">Rule</Typography>
        </TableCell>
        <TableCell
          data-testid="allegationsParagraphHeader"
          className={classes.cell}
          style={{ width: "25%" }}
        >
          <Typography variant="subtitle2">Paragraph</Typography>
        </TableCell>
        <TableCell className={classes.cell} style={{ width: "10%" }} />
      </TableRow>
    </TableHead>
  );
};

export default withStyles(styles, { withTheme: true })(
  AllegationSearchTableHeader
);
