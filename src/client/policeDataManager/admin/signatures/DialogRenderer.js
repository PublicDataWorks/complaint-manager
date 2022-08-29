import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import AddSignatureDialog from "./AddSignatureDialog";
import UpdateSignatureDialog from "./UpdateSignatureDialog";
import ConfirmationDialog from "../../shared/components/ConfirmationDialog";

const DialogRenderer = ({
  signers,
  signerDialog,
  setSignerDialog,
  setLoadSigners,
  snackbarSuccess,
  snackbarError
}) => {
  const closeDialog = isThereNewData => {
    if (isThereNewData) {
      setLoadSigners(true);
    }
    setSignerDialog({});
  };

  switch (signerDialog.type) {
    case "new":
      return (
        <AddSignatureDialog classes={{}} exit={closeDialog} signers={signers} />
      );
    case "edit":
      return (
        <UpdateSignatureDialog
          classes={{}}
          exit={closeDialog}
          signer={signerDialog.signer}
        />
      );
    case "delete":
      return (
        <ConfirmationDialog
          cancelText="Cancel"
          confirmText="Delete"
          onConfirm={async () => {
            const deleteLink = signerDialog.signer.links.find(
              link => link.rel === "delete"
            );
            await axios
              .delete(deleteLink.href)
              .then(() => {
                snackbarSuccess("Signer successfully deleted");
              })
              .catch(err => snackbarError(err.message));
            closeDialog(true);
          }}
          onCancel={() => closeDialog(false)}
          title="Remove Signature"
        >
          This action will permanently delete this signature. Are you sure you
          want to continue?
        </ConfirmationDialog>
      );
    default:
      return "";
  }
};

export default connect(undefined, { snackbarSuccess, snackbarError })(
  DialogRenderer
);
