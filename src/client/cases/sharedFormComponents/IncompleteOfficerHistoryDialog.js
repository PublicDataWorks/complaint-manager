import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import { closeIncompleteOfficerHistoryDialog } from "../../actionCreators/letterActionCreators";
import { connect } from "react-redux";
import { push } from "connected-react-router";

const IncompleteOfficerHistoryDialog = ({
  open,
  caseId,
  closeIncompleteOfficerHistoryDialog,
  redirectBackToOfficerHistory,
  officerIndex
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle data-test="incompleteOfficerHistoryTitle">
        Missing Officer History
      </DialogTitle>
      <DialogContent>
        <Typography style={{ marginBottom: "24px" }} data-test="dialogText">
          In order to submit your letter, you must complete the{" "}
          <strong>Officer Complaint History</strong>. Please return to this step
          and fill in the pertinent details.
        </Typography>
      </DialogContent>
      <DialogActions>
        <PrimaryButton
          data-test="close-incomplete-officer-history-dialog"
          onClick={() => {
            closeIncompleteOfficerHistoryDialog();
            redirectBackToOfficerHistory(caseId, officerIndex);
          }}
        >
          Return
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const redirectBackToOfficerHistory = (caseId, officerIndex) => dispatch => {
  dispatch(
    push({
      pathname: `/cases/${caseId}/letter/officer-history`,
      state: {
        selectedTab: officerIndex,
        caseId: caseId
      }
    })
  );
};

const mapDispatchToProps = {
  closeIncompleteOfficerHistoryDialog,
  redirectBackToOfficerHistory
};

const mapStateToProps = state => ({
  open: state.ui.incompleteOfficerHistoryDialog.open,
  officerIndex: state.ui.incompleteOfficerHistoryDialog.state
    ? state.ui.incompleteOfficerHistoryDialog.state.selectedTab
    : 0
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IncompleteOfficerHistoryDialog);
