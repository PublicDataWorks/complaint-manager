import React, { useState } from "react";
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
import { SecondaryButton } from "../shared/components/StyledButtons";
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
      <Dialog
        open={dialog === "edit"}
        classes={{
          paperWidthSm: props.classes.paperWidthSm
        }}
      >
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>Hi</DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => setDialog(null)}>
            Cancel
          </SecondaryButton>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
};

export default withStyles(styles, { withTheme: true })(TagTableRow);
