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
import React from "react";
import restoreArchivedCase from "../../thunks/restoreArchivedCase";
import { reduxForm } from "redux-form";
import { RESTORE_ARCHIVED_CASE_FORM } from "../../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import { closeRestoreArchivedCaseDialog } from "../../../actionCreators/casesActionCreators";

const RestoreArchivedCaseDialog = ({
  dialogOpen,
  caseId,
  closeRestoreArchivedCaseDialog,
  restoreArchivedCase,
  submitting
}) => {
  return (
    <Dialog open={dialogOpen} fullWidth={true}>
      <DialogTitle>Restore Case</DialogTitle>
      <DialogContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
        >
          This action will restore this case to the <strong>All Cases</strong>{" "}
          page and it will no longer be archived.
        </Typography>
        <Typography>
          Are you sure you want to <strong>Restore Case</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          data-test="cancelRestoreArchivedCaseButton"
          onClick={closeRestoreArchivedCaseDialog}
          disabled={submitting}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="confirmRestoreArchivedCase"
          onClick={() => {
            restoreArchivedCase(caseId);
          }}
          disabled={submitting}
        >
          Restore Case
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  dialogOpen: state.ui.restoreArchivedCaseDialog.open,
  caseId: state.currentCase.details.id
});

const mapDispatchToProps = {
  closeRestoreArchivedCaseDialog,
  restoreArchivedCase
};

const connectedForm = reduxForm({
  form: RESTORE_ARCHIVED_CASE_FORM
})(RestoreArchivedCaseDialog);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(connectedForm);
