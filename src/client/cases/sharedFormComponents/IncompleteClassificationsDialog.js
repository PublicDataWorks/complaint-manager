import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import { closeIncompleteClassificationsDialog } from "../../actionCreators/letterActionCreators";
import { connect } from "react-redux";
import { push } from "connected-react-router";

const IncompleteClassificationsDialog = ({
  open,
  caseId,
  closeIncompleteClassificationsDialog,
  redirectBackToRecommendedActions
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle data-test="incompleteClassificationsTitle">
        Missing Classifications
      </DialogTitle>
      <DialogContent>
        <Typography style={{ marginBottom: "24px" }} data-test="dialogText">
          In order to submit your letter, you must complete{" "}
          <strong>Recommended Actions - Classifications</strong>. Please return
          to this step and fill in the pertinent details.
        </Typography>
      </DialogContent>
      <DialogActions>
        <PrimaryButton
          data-test="close-incomplete-classifications-dialog"
          onClick={() => {
            closeIncompleteClassificationsDialog();
            redirectBackToRecommendedActions(caseId);
          }}
        >
          Return
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const redirectBackToRecommendedActions = caseId => dispatch => {
  dispatch(
    push({
      pathname: `/cases/${caseId}/letter/recommended-actions`,
      state: {
        caseId: caseId
      }
    })
  );
};

const mapDispatchToProps = {
  closeIncompleteClassificationsDialog,
  redirectBackToRecommendedActions
};

const mapStateToProps = state => ({
  open: state.ui.openIncompleteClassificationsDialog.open
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IncompleteClassificationsDialog);
