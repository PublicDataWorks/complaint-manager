import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import { closeArchiveCaseDialog } from "../../../actionCreators/casesActionCreators";
import archiveCase from "../../thunks/archiveCase";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";

const ArchiveCaseDialog = ({
  dialogOpen,
  caseId,
  closeArchiveCaseDialog,
  archiveCase
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
          data-test="cancelArchiveCaseButton"
          onClick={closeArchiveCaseDialog}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="confirmArchiveCase"
          onClick={() => {
            archiveCase(caseId);
          }}
        >
          Archive Case
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  dialogOpen: state.ui.archiveCaseDialog.open,
  caseId: state.currentCase.details.id
});

const mapDispatchToProps = {
  closeArchiveCaseDialog,
  archiveCase
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchiveCaseDialog);
