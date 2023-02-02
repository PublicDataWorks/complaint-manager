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
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";

const RemoveOfficerHistoryNoteDialog = ({
  dialogOpen,
  closeDialog,
  removeNote,
  fieldArrayName,
  noteIndex,
  noteDetails,
  snackbarSuccess
}) => {
  const removeOfficerHistoryNote = () => {
    closeDialog();
    removeNote(fieldArrayName, noteIndex);
    snackbarSuccess("Note was successfully removed");
  };

  return (
    <Dialog open={dialogOpen} fullWidth={true}>
      <DialogTitle>Remove Note</DialogTitle>
      <DialogContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
        >
          This action will remove the following note from{" "}
          {noteDetails.caseOfficerName}:
        </Typography>
        <div
          style={{
            marginBottom: "24px",
            marginLeft: "24px",
            borderLeft: "solid lightgrey 4px",
            paddingLeft: "8px"
          }}
        >
          <Typography>
            Case Reference Number: {noteDetails.pibCaseNumber}
          </Typography>
        </div>
        <Typography>Are you sure you want to continue?</Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton data-testid="cancelButton" onClick={closeDialog}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-testid="removeOfficerHistoryNoteButton"
          onClick={removeOfficerHistoryNote}
        >
          Remove
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default connect(undefined, { snackbarSuccess })(
  RemoveOfficerHistoryNoteDialog
);
