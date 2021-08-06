import React, { useState } from "react";
import EditTagDialog from "./EditTagDialog";
import { TableCell, TableRow } from "@material-ui/core";
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
      {dialog === "edit" ? (
        <EditTagDialog
          classes={{}}
          tag={props.tag}
          open={dialog === "edit"}
          exit={() => setDialog(null)}
          form={`EditTagForm${props.tag.id}`}
        />
      ) : (
        ""
      )}
    </TableRow>
  );
};

export default withStyles(styles, { withTheme: true })(TagTableRow);
