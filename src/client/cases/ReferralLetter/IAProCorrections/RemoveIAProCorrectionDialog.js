import React from "react";
import { connect } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { closeRemoveIAProCorrectionDialog } from "../../../actionCreators/letterActionCreators";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";

const RemoveIAProCorrectionDialog = ({
  dialogOpen,
  closeRemoveIAProCorrectionDialog,
  removeFunction,
  fieldArrayName,
  correctionIndex,
  snackbarSuccess
}) => {
  const removeIAProCorrection = () => {
    closeRemoveIAProCorrectionDialog();
    removeFunction(fieldArrayName, correctionIndex);
    snackbarSuccess("IAPro correction was successfully removed");
  };

  return (
    <Dialog open={dialogOpen} fullWidth={true}>
      <DialogTitle>Remove IAPro Correction</DialogTitle>
      <DialogContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
        >
          This action will remove the selected IAPro Correction.
        </Typography>
        <Typography>Are you sure you want to continue?</Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          data-test="cancelButton"
          onClick={closeRemoveIAProCorrectionDialog}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="remove-iapro-correction-button"
          onClick={removeIAProCorrection}
        >
          Remove
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapDispatchToProps = {
  closeRemoveIAProCorrectionDialog,
  snackbarSuccess
};

const mapStateToProps = state => ({
  dialogOpen: state.ui.iaProCorrectionsDialog.dialogOpen,
  fieldArrayName: state.ui.iaProCorrectionsDialog.fieldArrayName,
  correctionIndex: state.ui.iaProCorrectionsDialog.correctionIndex
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveIAProCorrectionDialog);
