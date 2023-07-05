import formatStringToTitleCase from "../utilities/formatStringToTitleCase";
import React, { Fragment } from "react";
import { TableCell } from "@material-ui/core";
import tableStyleGenerator from "../../tableStyles";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

const Allegation = ({ classes, allegation }) => {
  const primaryCellClasses = `${classes.cell} ${classes.noBorderBottom}`;

  return (
    <Fragment>
      <TableCell className={primaryCellClasses}>
        {formatStringToTitleCase(allegation.rule)}
      </TableCell>
      <TableCell className={primaryCellClasses}>
        {formatStringToTitleCase(allegation.paragraph)}
      </TableCell>
    </Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(Allegation);
