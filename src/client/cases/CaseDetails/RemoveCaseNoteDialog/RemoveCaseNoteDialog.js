import React from "react";
import { connect } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import {
  SecondaryButton,
  PrimaryButton
} from "../../../shared/components/StyledButtons";
import {
  closeRemoveCaseNoteDialog,
  removeCaseNoteRequest
} from "../../../actionCreators/casesActionCreators";
import moment from "moment";

const RemoveCaseNoteDialog = ({ dialogOpen, activity, dispatch }) => {
  return (
    <Dialog open={dialogOpen} fullWidth={true}>
      <DialogTitle>Remove Case Note</DialogTitle>
      <DialogContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
        >
          This action will remove the following note:
        </Typography>
        <div
          style={{
            marginBottom: "24px",
            marginLeft: "24px",
            borderLeft: "solid lightgrey 4px",
            paddingLeft: "8px"
          }}
        >
          <Typography>
            <strong>[{activity.user}]</strong> {activity.action}
          </Typography>
          <Typography
            variant="caption"
            style={{
              marginBottom: "16px"
            }}
          >
            {moment(activity.actionTakenAt).fromNow()}
          </Typography>
          {activity.notes ? <Typography>{activity.notes}</Typography> : null}
        </div>
        <Typography>Are you sure you want to continue?</Typography>
      </DialogContent>
      <DialogActions>
        <SecondaryButton
          data-test="cancelButton"
          onClick={() => dispatch(closeRemoveCaseNoteDialog())}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="removeCaseNote"
          onClick={() =>
            dispatch(removeCaseNoteRequest(activity.caseId, activity.id))
          }
        >
          Remove
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  dialogOpen: state.ui.removeCaseNoteDialog.dialogOpen,
  activity: state.ui.removeCaseNoteDialog.activity
});

export default connect(mapStateToProps)(RemoveCaseNoteDialog);
