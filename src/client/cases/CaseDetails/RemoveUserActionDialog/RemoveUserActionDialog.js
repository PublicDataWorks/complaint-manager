import React from "react";
import { connect } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "material-ui";
import {
  SecondaryButton,
  PrimaryButton
} from "../../../sharedComponents/StyledButtons";
import removeUserAction from "../../thunks/removeUserAction";
import { closeRemoveUserActionDialog } from "../../../actionCreators/casesActionCreators";

const RemoveUserActionDialog = ({
  dialogOpen,
  caseId,
  userActionId,
  dispatch
}) => {
  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Remove Case Note</DialogTitle>
      <DialogContent>
        <Typography>
          This action will remove this note and its information. Are you sure
          you want to continue?
        </Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          data-test="cancelButton"
          onClick={() => dispatch(closeRemoveUserActionDialog())}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="removeUserAction"
          onClick={() => dispatch(removeUserAction(caseId, userActionId))}
        >
          Remove
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  dialogOpen: state.ui.removeUserActionDialog.dialogOpen,
  caseId: state.ui.removeUserActionDialog.caseId,
  userActionId: state.ui.removeUserActionDialog.userActionId
});

export default connect(mapStateToProps)(RemoveUserActionDialog);
