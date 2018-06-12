import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import formatDate from "../../utilities/formatDate";
import tableStyleGenerator from "../../tableStyles";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

const UserRow = ({
  user: { id, firstName, lastName, email, createdAt },
  classes
}) => (
  <TableRow data-test={`userRow${id}`} className={classes.row}>
    <TableCell data-test="userName" className={classes.cell}>
      {`${firstName} ${lastName}`}
    </TableCell>
    <TableCell data-test="userEmail" className={classes.cell}>
      {email}
    </TableCell>
    <TableCell data-test="userDateAdded" className={classes.cell}>
      {formatDate(createdAt)}
    </TableCell>
  </TableRow>
);

export default withStyles(styles, { withTheme: true })(UserRow);
