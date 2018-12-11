import React from "react";
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
import { connect } from "react-redux";
import setCaseStatus from "../../thunks/setCaseStatus";
import { closeCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

const STATUS_DESCRIPTION = {
  [CASE_STATUS.LETTER_IN_PROGRESS]:
    "This status signifies that all available information has been entered and the letter generation process has started.",
  [CASE_STATUS.READY_FOR_REVIEW]:
    "This status signifies, to the Deputy Police Monitor, that all available information has been entered.",
  [CASE_STATUS.FORWARDED_TO_AGENCY]:
    "This status signifies that the case has been sent to the investigation agency.",
  [CASE_STATUS.CLOSED]:
    "This status signifies that an outcome has been reached and this case is available for public records."
};

const UpdateCaseStatusDialog = ({
  open,
  caseId,
  nextStatus,
  redirectUrl,
  alternativeAction,
  setCaseStatus,
  closeCaseStatusUpdateDialog,
  doNotCallUpdateStatusCallback = false
}) => {
  const actionText =
    nextStatus === CASE_STATUS.LETTER_IN_PROGRESS
      ? "Choosing to Generate a Letter"
      : "This action";

  const updateCaseStatusAction = () => {
    if (alternativeAction && doNotCallUpdateStatusCallback) {
      alternativeAction(caseId, closeCaseStatusUpdateDialog);
    } else if (alternativeAction) {
      alternativeAction(updateCaseStatus, closeCaseStatusUpdateDialog)();
    } else {
      updateCaseStatus();
    }
  };

  const updateCaseStatus = () => {
    setCaseStatus(caseId, nextStatus, redirectUrl);
  };

  return (
    <Dialog open={open}>
      <DialogTitle data-test="updateStatusDialogTitle">
        Update Case Status
      </DialogTitle>
      <DialogContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
          data-test="dialogText"
        >
          {actionText} will mark the case as <strong>{nextStatus}</strong>
          .&nbsp;{STATUS_DESCRIPTION[nextStatus]}
        </Typography>
        <Typography>
          Are you sure you want to mark this case as{" "}
          <strong>{nextStatus}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          data-test="closeDialog"
          onClick={() => {
            closeCaseStatusUpdateDialog();
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="update-case-status-button"
          onClick={updateCaseStatusAction}
        >
          {nextStatus === CASE_STATUS.LETTER_IN_PROGRESS
            ? `Begin Letter`
            : `Mark as ${nextStatus}`}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapDispatchToProps = {
  closeCaseStatusUpdateDialog,
  setCaseStatus
};

const mapStateToProps = state => ({
  open: state.ui.updateCaseStatusDialog.open,
  redirectUrl: state.ui.updateCaseStatusDialog.redirectUrl,
  nextStatus: state.currentCase.details.nextStatus,
  caseId: state.currentCase.details.id
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateCaseStatusDialog);
