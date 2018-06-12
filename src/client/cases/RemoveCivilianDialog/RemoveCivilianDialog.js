import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  SecondaryButton,
  PrimaryButton
} from "../../shared/components/StyledButtons";
import { closeRemoveCivilianDialog } from "../../actionCreators/casesActionCreators";
import removeCivilian from "../thunks/removeCivilian";

const RemoveCivilianDialog = ({ open, civilianDetails, dispatch }) => (
  <Dialog open={open}>
    <DialogTitle data-test="dialogTitle">Remove Civilian</DialogTitle>
    <DialogContent>
      <Typography data-test="warningText">
        This action will remove <strong>{civilianDetails.fullName}</strong> and
        all information associated to this person from the case. Are you sure
        you want to continue?
      </Typography>
    </DialogContent>
    <DialogActions>
      <SecondaryButton
        onClick={() => dispatch(closeRemoveCivilianDialog())}
        data-test="cancelButton"
      >
        Cancel
      </SecondaryButton>
      <PrimaryButton
        data-test="removeButton"
        onClick={() =>
          dispatch(removeCivilian(civilianDetails.id, civilianDetails.caseId))
        }
      >
        Remove
      </PrimaryButton>
    </DialogActions>
  </Dialog>
);
const mapStateToProps = state => ({
  open: state.ui.removeCivilianDialog.open,
  civilianDetails: state.ui.removeCivilianDialog.civilianDetails
});

export default connect(mapStateToProps)(RemoveCivilianDialog);
