import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import tableStyleGenerator from "../../tableStyles";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

const TagTableRow = props => (
  <TableRow
    className={`${props.classes.row}`}
    hover
    style={{ cursor: "pointer", height: "70px" }}
  >
    <TableCell className={props.classes.cell}>
      <div>{props.tag.name}</div>
    </TableCell>
    <TableCell className={props.classes.cell}>{props.tag.count}</TableCell>
  </TableRow>
);

export default withStyles(styles, { withTheme: true })(TagTableRow);
