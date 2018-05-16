import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "material-ui";
import { TextField } from "redux-form-material-ui";
import { connect } from "react-redux";
import {
  SecondaryButton,
  PrimaryButton
} from "../../../sharedComponents/StyledButtons";
import { closeUserActionDialog } from "../../../actionCreators/casesActionCreators";
import { Field, reduxForm, reset } from "redux-form";
import DateField from "../../sharedFormComponents/DateField";
import NoBlurTextField from "../CivilianDialog/FormSelect";
import { userActions } from "../../../utilities/generateMenus";
import addUserAction from "../../thunks/addUserAction";
import { actionIsRequired } from "../../../formFieldLevelValidations";
import timezone from "moment-timezone";
import { TIMEZONE } from "../../../../sharedUtilities/constants";
import editUserAction from "../../thunks/editUserAction";

const UserActionDialog = ({
  open,
  caseId,
  handleSubmit,
  dialogType,
  dispatch
}) => {
  const submit = (values, dispatch) => {
    const valuesToSubmit = {
      ...values,
      actionTakenAt: timezone.tz(values.actionTakenAt, TIMEZONE).format(),
      caseId
    };

    switch (dialogType) {
      case "Add":
        dispatch(addUserAction(valuesToSubmit));
        break;
      case "Edit":
        dispatch(editUserAction(valuesToSubmit));
        break;
      default:
        break;
    }
  };

  return (
    <Dialog open={open} maxWidth={"sm"}>
      <DialogTitle
        style={{
          paddingBottom: "8px"
        }}
        data-test="userActionDialogTitle"
      >
        {dialogType ? `${dialogType} Case Note` : " "}
      </DialogTitle>
      <DialogContent
        style={{
          padding: "0px 28px",
          marginBottom: "24px"
        }}
      >
        <Typography
          type="body1"
          style={{
            marginBottom: "24px"
          }}
        >
          Use this form to log any external correspondences or actions that take
          place outside of the Complaint Manager System. Your name will
          automatically be recorded.
        </Typography>
        <form>
          <DateField
            required
            name={"actionTakenAt"}
            inputProps={{
              type: "datetime-local",
              "data-test": "dateAndTimeInput"
            }}
            label={"Date and Time"}
            style={{
              marginBottom: "16px",
              width: "41%"
            }}
          />
          <br />
          <Field
            required
            name="action"
            component={NoBlurTextField}
            label={"Select Action Taken"}
            data-test="actionsDropdown"
            style={{
              width: "75%",
              marginBottom: "16px"
            }}
            validate={[actionIsRequired]}
          >
            {userActions}
          </Field>
          <Field
            name="notes"
            label="Notes"
            component={TextField}
            inputProps={{
              maxLength: 255,
              "data-test": "notesInput"
            }}
            InputLabelProps={{
              shrink: true
            }}
            multiline
            placeholder="Enter any notes about this action"
            fullWidth
          />
        </form>
      </DialogContent>
      <DialogActions
        style={{
          padding: "0px 24px 16px 24px",
          marginLeft: "0",
          marginRight: "0",
          justifyContent: "space-between"
        }}
      >
        <SecondaryButton
          style={{
            marginLeft: "0px"
          }}
          data-test="cancelButton"
          onClick={() => {
            dispatch(reset("UserActions"));
            dispatch(closeUserActionDialog());
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton data-test="submitButton" onClick={handleSubmit(submit)}>
          {dialogType ? `${dialogType} Case Note` : " "}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const ConnectedForm = reduxForm({
  form: "UserActions"
})(UserActionDialog);

const mapStateToProps = state => ({
  open: state.ui.userActionDialog.open,
  caseId: state.currentCase.details.id,
  dialogType: state.ui.userActionDialog.dialogType
});
export default connect(mapStateToProps)(ConnectedForm);
