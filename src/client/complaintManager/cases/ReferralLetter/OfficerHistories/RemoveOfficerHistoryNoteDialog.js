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
import { closeRemoveOfficerHistoryNoteDialog } from "../../../actionCreators/letterActionCreators";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";

const RemoveOfficerHistoryNoteDialog = ({
  dialogOpen,
  closeRemoveOfficerHistoryNoteDialog,
  removeNote,
  fieldArrayName,
  noteIndex,
  noteDetails,
  snackbarSuccess
}) => {
  const removeOfficerHistoryNote = () => {
    closeRemoveOfficerHistoryNoteDialog();
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
        <SecondaryButton
          data-test="cancelButton"
          onClick={closeRemoveOfficerHistoryNoteDialog}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="removeOfficerHistoryNoteButton"
          onClick={removeOfficerHistoryNote}
        >
          Remove
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapDispatchToProps = {
  closeRemoveOfficerHistoryNoteDialog,
  snackbarSuccess
};

const mapStateToProps = state => ({
  dialogOpen: state.ui.officerHistoryNoteDialog.dialogOpen,
  fieldArrayName: state.ui.officerHistoryNoteDialog.fieldArrayName,
  noteIndex: state.ui.officerHistoryNoteDialog.noteIndex,
  noteDetails: state.ui.officerHistoryNoteDialog.noteDetails
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveOfficerHistoryNoteDialog);
