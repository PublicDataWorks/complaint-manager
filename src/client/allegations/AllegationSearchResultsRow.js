import React from "react";
import tableStyleGenerator from "../tableStyles";
import { TableCell, TableRow, withStyles } from "material-ui";
import formatStringToTitleCase from "../utilities/formatStringToTitleCase";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

const AllegationSearchResultsRow = ({ classes, allegation, children }) => {
  return (
    <TableRow className={classes.row}>
      <TableCell className={classes.cell}>
        {formatStringToTitleCase(allegation.rule)}
      </TableCell>
      <TableCell className={classes.cell}>
        {formatStringToTitleCase(allegation.paragraph)}
      </TableCell>
      <TableCell className={classes.cell}>
        {allegation.directive
          ? formatStringToTitleCase(allegation.directive)
          : "N/A"}
      </TableCell>
      <TableCell className={classes.buttonCell}>{children}</TableCell>
    </TableRow>
  );
};

export default withStyles(styles, { withTheme: true })(
  AllegationSearchResultsRow
);
