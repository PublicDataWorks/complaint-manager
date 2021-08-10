import React, { useState } from "react";
import PropTypes from "prop-types";
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
      data-testid={`tagTableRow-${props.tag.name}`}
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

TagTableRow.propTypes = {
  classes: PropTypes.object,
  tag: PropTypes.shape({
    count: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string
  })
};

export default withStyles(styles, { withTheme: true })(TagTableRow);
