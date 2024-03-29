import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import EditTagDialog from "./EditTagDialog";
import { TableCell, TableRow, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import LinkButton from "../shared/components/LinkButton";
import ConfirmationDialog from "../shared/components/ConfirmationDialog";
import getTagsWithCount from "./thunks/getTagsWithCount";
import tableStyleGenerator from "../../tableStyles";
import MergeTagDialog from "./MergeTagDialog";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

export const TagTableRow = props => {
  const [dialog, setDialog] = useState(null);

  const renderDialog = () => {
    switch (dialog) {
      case "edit":
        return (
          <EditTagDialog
            classes={{}}
            tag={props.tag}
            open={dialog === "edit"}
            exit={() => setDialog(null)}
            form={`EditTagForm${props.tag.id}`}
          />
        );
      case "remove":
        return (
          <ConfirmationDialog
            buttonStyle="SPLIT"
            confirmText="DELETE TAG"
            onConfirm={async () => {
              await axios.delete(`api/tags/${props.tag.id}`);
              props.getTagsWithCount();
              setDialog(null);
            }}
            onCancel={() => setDialog(null)}
            title="Remove Tag"
          >
            You are about to delete the tag <strong>"{props.tag.name}"</strong>
          </ConfirmationDialog>
        );
      case "merge":
        return (
          <MergeTagDialog
            tag={props.tag}
            open={dialog === "merge"}
            form={`MergeTagForm${props.tag.id}`}
            closeDialog={() => setDialog(null)}
          />
        );
      default:
        return undefined;
    }
  };

  return (
    <TableRow
      className={`${props.classes.row}`}
      hover
      style={{ cursor: "pointer", height: "70px" }}
      data-testid={`tagTableRow-${props.tag.name}`}
    >
      <TableCell
        className={props.classes.cell}
        style={{ paddingRight: "24px" }}
      >
        <div>{props.tag.name}</div>
      </TableCell>
      <TableCell
        className={props.classes.cell}
        style={{ paddingRight: "24px" }}
      >
        {props.tag.count}
      </TableCell>
      {props.permissions &&
      props.permissions?.includes(USER_PERMISSIONS.MANAGE_TAGS) ? (
        <>
          <TableCell
            className={props.classes.cell}
            style={{ paddingRight: "24px" }}
          >
            <LinkButton
              data-testid="editTagButton"
              onClick={() => setDialog("edit")}
            >
              Rename
            </LinkButton>
          </TableCell>
          <TableCell
            className={props.classes.cell}
            style={{ paddingRight: "24px" }}
          >
            <LinkButton
              data-testid="mergeTagButton"
              onClick={() => setDialog("merge")}
            >
              Merge
            </LinkButton>
          </TableCell>
          <TableCell
            className={props.classes.cell}
            style={{ paddingRight: "24px" }}
          >
            <LinkButton
              style={{ color: "#d32f2f" }}
              data-testid="removeTagButton"
              onClick={() => setDialog("remove")}
            >
              Remove
            </LinkButton>
          </TableCell>
          {renderDialog()}
        </>
      ) : undefined}
    </TableRow>
  );
};

TagTableRow.propTypes = {
  classes: PropTypes.object,
  tag: PropTypes.shape({
    count: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string
  }),
  permissions: PropTypes.arrayOf(PropTypes.string)
};

export default withStyles(styles, { withTheme: true })(
  connect(
    state => ({ permissions: state?.users?.current?.userInfo?.permissions }),
    {
      getTagsWithCount
    }
  )(TagTableRow)
);
