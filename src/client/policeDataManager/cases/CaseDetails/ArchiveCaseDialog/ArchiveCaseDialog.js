import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import archiveCase from "../../thunks/archiveCase";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { ARCHIVE_CASE_FORM_NAME } from "../../../../../sharedUtilities/constants";

const ArchiveCaseDialog = ({
  dialogOpen,
  caseId,
  closeDialog,
  archiveCase,
  submitting
}) => {
  return (
    <Dialog open={dialogOpen} fullWidth={true}>
      <DialogTitle>Archive Case</DialogTitle>
      <DialogContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
        >
          This action will mark the case as <strong>Archived</strong>. You will
          be returned to the All Cases page and this case will no longer be
          accessible.
        </Typography>
        <Typography>
          Are you sure you want to <strong>Archive Case</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          data-testid="cancelArchiveCaseButton"
          onClick={closeDialog}
          disabled={submitting}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-testid="confirmArchiveCase"
          onClick={() => {
            archiveCase(caseId);
            closeDialog();
          }}
          disabled={submitting}
        >
          Archive Case
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id
});

const mapDispatchToProps = {
  archiveCase
};

const connectedForm = reduxForm({
  form: ARCHIVE_CASE_FORM_NAME
})(ArchiveCaseDialog);

export default connect(mapStateToProps, mapDispatchToProps)(connectedForm);
