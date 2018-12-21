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
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import { closeRemovePersonDialog } from "../../actionCreators/casesActionCreators";
import removePerson from "../thunks/removePerson";

const RemovePersonDialog = ({
  open,
  personDetails,
  dispatch,
  personTypeTitleDisplay,
  optionalText
}) => (
  <Dialog open={open}>
    <DialogTitle data-test="removePersonDialogTitle">
      Remove {personTypeTitleDisplay}
    </DialogTitle>
    <DialogContent>
      <Typography data-test="warningText">
        This action will remove <strong>{personDetails.fullName}</strong> and
        all information associated to this person from the case.{optionalText}{" "}
        Are you sure you want to continue?
      </Typography>
    </DialogContent>
    <DialogActions>
      <SecondaryButton
        onClick={() => dispatch(closeRemovePersonDialog())}
        data-test="cancelButton"
      >
        Cancel
      </SecondaryButton>
      <PrimaryButton
        data-test="removeButton"
        onClick={() => dispatch(removePerson(personDetails))}
      >
        Remove
      </PrimaryButton>
    </DialogActions>
  </Dialog>
);
const mapStateToProps = state => ({
  open: state.ui.removePersonDialog.open,
  personDetails: state.ui.removePersonDialog.personDetails,
  personTypeTitleDisplay: state.ui.removePersonDialog.personTypeTitleDisplay,
  optionalText: state.ui.removePersonDialog.optionalText
});

export default connect(mapStateToProps)(RemovePersonDialog);
