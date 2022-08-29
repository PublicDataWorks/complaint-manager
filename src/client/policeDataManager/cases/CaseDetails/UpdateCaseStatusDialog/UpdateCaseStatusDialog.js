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

export const STATUSES = {
  [CASE_STATUS.LETTER_IN_PROGRESS]: {
    actionText: "Choosing to Generate a Letter",
    confirmButtonText: "Begin Letter",
    description:
      "This status signifies that all available information has been entered and the letter generation process has started."
  },
  [CASE_STATUS.READY_FOR_REVIEW]: {
    actionText: "This action",
    confirmButtonText: `Mark as ${CASE_STATUS.READY_FOR_REVIEW}`,
    description:
      "This status signifies, to the Deputy Police Monitor, that all available information has been entered."
  },
  [CASE_STATUS.FORWARDED_TO_AGENCY]: {
    actionText: "This action",
    confirmButtonText: `Mark as ${CASE_STATUS.FORWARDED_TO_AGENCY}`,
    description:
      "This status signifies that the case has been sent to the investigation agency."
  },
  [CASE_STATUS.ACTIVE]: {
    actionText: "This action",
    confirmButtonText: `Mark as ${CASE_STATUS.ACTIVE}`,
    description:
      "This status signifies that either an officer has been added to this case or is not needed."
  },
  [CASE_STATUS.CLOSED]: {
    actionText: "This action",
    confirmButtonText: `Mark as ${CASE_STATUS.CLOSED}`,
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
          {STATUSES[nextStatus]?.actionText} will mark the case as{" "}
          <strong>{nextStatus}</strong>
          .&nbsp;{STATUSES[nextStatus]?.description}
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
          {STATUSES[nextStatus]?.confirmButtonText}
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
