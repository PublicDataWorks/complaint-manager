import React, { useState } from "react";
import EditTagDialog from "./EditTagDialog";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import LinkButton from "../shared/components/LinkButton";
import tableStyleGenerator from "../../tableStyles";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

const TagTableRow = props => {
  const [dialog, setDialog] = useState(null);

  return (
    <TableRow
      className={`${props.classes.row}`}
      hover
      style={{ cursor: "pointer", height: "70px" }}
    >
      <TableCell className={props.classes.cell}>
        <div>{props.tag.name}</div>
      </TableCell>
      <TableCell className={props.classes.cell}>{props.tag.count}</TableCell>
      <TableCell className={props.classes.cell}>
        <LinkButton
          data-testid="editTagButton"
          onClick={() => setDialog("edit")}
        >
          Edit
        </LinkButton>
      </TableCell>
      <EditTagDialog
        classes={{}}
        tag={{ name: "Mr. Tag", id: 2 }}
        open={dialog === "edit"}
      ></EditTagDialog>
    </TableRow>
  );
};

export default withStyles(styles, { withTheme: true })(TagTableRow);
