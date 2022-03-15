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
import {
  closeCaseStatusUpdateDialog,
  submitCaseStatusUpdateDialog
} from "../../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const STATUSES = {
  [CASE_STATUS.LETTER_IN_PROGRESS]: {
    description:
      "This status signifies that all available information has been entered and the letter generation process has started."
  },
  [CASE_STATUS.READY_FOR_REVIEW]: {
    description:
      "This status signifies, to the Deputy Police Monitor, that all available information has been entered."
  },
  [CASE_STATUS.FORWARDED_TO_AGENCY]: {
    description:
      "This status signifies that the case has been sent to the investigation agency."
  },
  [CASE_STATUS.CLOSED]: {
    description:
      "This status signifies that an outcome has been reached and this case is available for public records."
  }
};

const UpdateCaseStatusDialog = ({
  open,
  caseId,
  nextStatus,
  redirectUrl,
  alternativeAction,
  setCaseStatus,
  submittable,
  closeCaseStatusUpdateDialog,
  submitCaseStatusUpdateDialog,
  doNotCallUpdateStatusCallback = false
}) => {
  const actionText =
    nextStatus === CASE_STATUS.LETTER_IN_PROGRESS
      ? "Choosing to Generate a Letter"
      : "This action";

  const updateCaseStatusAction = () => {
    submitCaseStatusUpdateDialog();
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
      <DialogTitle data-testid="updateStatusDialogTitle">
        Update Case Status
      </DialogTitle>
      <DialogContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
          data-testid="dialogText"
        >
          {actionText} will mark the case as <strong>{nextStatus}</strong>
          .&nbsp;{STATUSES[nextStatus].description}
        </Typography>
        <Typography>
          Are you sure you want to mark this case as{" "}
          <strong>{nextStatus}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <CircularProgress
          data-testid={"update-status-progress"}
          size={25}
          style={{ display: !submittable ? "" : "none" }}
        />
        <SecondaryButton
          data-testid="closeDialog"
          onClick={() => {
            closeCaseStatusUpdateDialog();
          }}
          disabled={!submittable}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-testid="update-case-status-button"
          onClick={updateCaseStatusAction}
          disabled={!submittable}
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
  submitCaseStatusUpdateDialog,
  setCaseStatus
};

const mapStateToProps = state => ({
  open: state.ui.updateCaseStatusDialog.open,
  submittable: state.ui.updateCaseStatusDialog.submittable,
  redirectUrl: state.ui.updateCaseStatusDialog.redirectUrl,
  nextStatus: state.ui.updateCaseStatusDialog.nextStatus,
  caseId: state.currentCase.details.id
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateCaseStatusDialog);
