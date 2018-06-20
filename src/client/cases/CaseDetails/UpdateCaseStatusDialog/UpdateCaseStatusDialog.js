import React from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography
} from "@material-ui/core";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { connect } from "react-redux";
import setCaseStatus from "../../thunks/setCaseStatus";
import { closeCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
const UpdateCaseStatusDialog = ({ dispatch, open, caseId, nextStatus }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Update Case Status</DialogTitle>
      <DialogContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
        >
          This action will mark the case as <strong>{nextStatus}</strong>.
          This status signifies, to the Deputy Police Monitor, that all
          available information has been entered.
        </Typography>
        <Typography>
          Are you sure you want to mark this case as <strong>{nextStatus}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          data-test="closeDialog"
          onClick={() => {
            dispatch(closeCaseStatusUpdateDialog());
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="updateCaseStatus"
          onClick={() => {
            dispatch(setCaseStatus(caseId, nextStatus));
          }}
        >{`Mark as ${nextStatus}`}</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  open: state.ui.updateCaseStatusDialog.open,
  nextStatus: state.ui.updateCaseStatusDialog.nextStatus,
  caseId: state.currentCase.details.id
});

export default connect(mapStateToProps)(UpdateCaseStatusDialog);
