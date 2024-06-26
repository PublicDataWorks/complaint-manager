import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { PrimaryButton, SecondaryButton } from "./StyledButtons";

const ConfirmationDialog = props => {
  let actionsStyle =
    props.buttonStyle === "SPLIT"
      ? { justifyContent: "space-between", margin: "5px 15px" }
      : { margin: "5px 0px" };
  return (
    <Dialog
      fullWidth={props.fullWidth}
      open={props.open}
      data-testid={`confirmation-dialog-${props.title.replaceAll(" ", "")}`}
    >
      <DialogTitle>
        {props.title}
        {props.closeButton}
      </DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions style={actionsStyle}>
        <SecondaryButton
          data-testid="dialog-cancel-button"
          onClick={props.onCancel}
        >
          {props.cancelText}
        </SecondaryButton>
        <PrimaryButton
          data-testid="dialog-confirm-button"
          onClick={props.onConfirm}
        >
          {props.confirmText}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.defaultProps = {
  buttonStyle: "RIGHT",
  cancelText: "Cancel",
  confirmText: "Confirm",
  fullWidth: false,
  open: true,
  title: "Confirm"
};

ConfirmationDialog.propTypes = {
  buttonStyle: PropTypes.oneOf(["SPLIT", "RIGHT"]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.string
  ]),
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  fullWidth: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool,
  title: PropTypes.string
};

export default ConfirmationDialog;
