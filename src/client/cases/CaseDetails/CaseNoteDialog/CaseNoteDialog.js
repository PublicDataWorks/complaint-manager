import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import { TextField } from "redux-form-material-ui";
import { connect } from "react-redux";
import {
  SecondaryButton,
  PrimaryButton
} from "../../../shared/components/StyledButtons";
import { closeCaseNoteDialog } from "../../../actionCreators/casesActionCreators";
import { Field, reduxForm, reset } from "redux-form";
import DateField from "../../sharedFormComponents/DateField";
import NoBlurTextField from "../CivilianDialog/FormSelect";
import { caseNotes } from "../../../utilities/generateMenus";
import addCaseNote from "../../thunks/addCaseNote";
import { actionIsRequired } from "../../../formFieldLevelValidations";
import timezone from "moment-timezone";
import moment from "moment";
import _ from "lodash";
import { TIMEZONE } from "../../../../sharedUtilities/constants";
import editCaseNote from "../../thunks/editCaseNote";

const CaseNoteDialog = props => {
  const {
    open,
    caseId,
    handleSubmit,
    dialogType,
    dispatch,
    initialCaseNote,
    submitting
  } = props;

  const submit = (values, dispatch) => {
    let valuesToSubmit = moment(values.actionTakenAt).isSame(
      initialCaseNote.actionTakenAt
    )
      ? { ..._.omit(values, ["actionTakenAt"]), caseId }
      : {
          ...values,
          actionTakenAt: timezone.tz(values.actionTakenAt, TIMEZONE).format(),
          caseId
        };

    switch (dialogType) {
      case "Add":
        return new Promise(resolve => {
          return dispatch(addCaseNote(valuesToSubmit, resolve));
        });
      case "Edit":
        return new Promise(resolve => {
          return dispatch(editCaseNote(valuesToSubmit, resolve));
        });
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
        data-test="caseNoteDialogTitle"
      >
        {dialogType === "Add" ? "Add Case Note" : "Edit Case Note"}
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
            label={"Action Taken"}
            data-test="actionsDropdown"
            style={{
              width: "75%",
              marginBottom: "16px"
            }}
            validate={[actionIsRequired]}
          >
            {caseNotes}
          </Field>
          <Field
            name="notes"
            label="Notes"
            component={TextField}
            inputProps={{
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
            dispatch(reset("CaseNotes"));
            dispatch(closeCaseNoteDialog());
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          data-test="submitButton"
          onClick={handleSubmit(submit)}
          disabled={submitting}
        >
          {dialogType === "Add" ? "Add Case Note" : "Save"}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

const ConnectedForm = reduxForm({
  form: "CaseNotes"
})(CaseNoteDialog);

const mapStateToProps = state => ({
  open: state.ui.caseNoteDialog.open,
  caseId: state.currentCase.details.id,
  dialogType: state.ui.caseNoteDialog.dialogType,
  initialCaseNote: state.ui.caseNoteDialog.initialCaseNote
});
export default connect(mapStateToProps)(ConnectedForm);
