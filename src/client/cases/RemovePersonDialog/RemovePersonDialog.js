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
import { reduxForm } from "redux-form";
import { REMOVE_PERSON_FORM_NAME } from "../../../sharedUtilities/constants";

const RemovePersonDialog = ({
  open,
  personDetails,
  dispatch,
  personTypeTitleDisplay,
  optionalText,
  submitting,
  handleSubmit,
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
        disabled={submitting}
      >
        Cancel
      </SecondaryButton>
      <PrimaryButton
        data-test="removeButton"
        onClick={handleSubmit(() => dispatch(removePerson(personDetails)))}
        disabled={submitting}
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

const connectedForm = reduxForm({
  form: REMOVE_PERSON_FORM_NAME
})(RemovePersonDialog);

export default connect(mapStateToProps)(connectedForm);
