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
import {
  CONFIGS,
  REMOVE_PERSON_FORM_NAME
} from "../../../../sharedUtilities/constants";

const RemovePersonDialog = ({
  dispatch,
  open,
  optionalText,
  pd,
  personDetails,
  personTypeTitleDisplay,
  submitting
}) => (
  <Dialog open={open}>
    <DialogTitle data-testid="removePersonDialogTitle">
      Remove {personTypeTitleDisplay}
    </DialogTitle>
    <DialogContent>
      <Typography data-testid="warningText">
        This action will remove <strong>{personDetails.fullName}</strong> and
        all information associated to this person from the case.{optionalText}{" "}
        Are you sure you want to continue?
      </Typography>
    </DialogContent>
    <DialogActions>
      <SecondaryButton
        onClick={() => dispatch(closeRemovePersonDialog())}
        data-testid="cancelButton"
      >
        Cancel
      </SecondaryButton>
      <PrimaryButton
        data-testid="removeButton"
        onClick={() => dispatch(removePerson(personDetails, pd))}
        disabled={submitting}
      >
        Remove
      </PrimaryButton>
    </DialogActions>
  </Dialog>
);

const mapStateToProps = state => ({
  open: state.ui.removePersonDialog.open,
  optionalText: state.ui.removePersonDialog.optionalText,
  pd: state.configs[CONFIGS.PD],
  personDetails: state.ui.removePersonDialog.personDetails,
  personTypeTitleDisplay: state.ui.removePersonDialog.personTypeTitleDisplay
});

const connectedForm = reduxForm({
  form: REMOVE_PERSON_FORM_NAME
})(RemovePersonDialog);

export default connect(mapStateToProps)(connectedForm);
