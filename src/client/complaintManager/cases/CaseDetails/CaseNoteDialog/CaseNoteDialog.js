import React, { Component } from "react";
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
} from "../../../shared/components/StyledButtons";
import { closeCaseNoteDialog } from "../../../actionCreators/casesActionCreators";
import { Field, reduxForm, reset } from "redux-form";
import DateField from "../../sharedFormComponents/DateField";
import Dropdown from "../../../../common/components/Dropdown";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import addCaseNote from "../../thunks/addCaseNote";
import { actionIsRequired } from "../../../../formFieldLevelValidations";
import timezone from "moment-timezone";
import moment from "moment";
import _ from "lodash";
import {
  CASE_NOTE_FORM_NAME,
  TIMEZONE
} from "../../../../../sharedUtilities/constants";
import editCaseNote from "../../thunks/editCaseNote";
import getCaseNoteActionDropdownValues from "../../../caseNoteActions/thunks/getCaseNoteActionDropdownValues";
import { TextFieldWithUserMention } from "./TextFieldWithUserMention";
import getUsers from "../../../../common/thunks/getUsers";

class CaseNoteDialog extends Component {
  componentDidMount() {
    this.props.getCaseNoteActionDropdownValues();
    this.props.getUsers();
    console.log("this.props", this.props);
  }

  submit = values => {
    const { caseId, initialCaseNote, dialogType } = this.props;

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
        this.props.addCaseNote(valuesToSubmit);
        break;
      case "Edit":
        this.props.editCaseNote(valuesToSubmit);
        break;
      default:
        break;
    }
  };

  render() {
    const { open, handleSubmit, dialogType, submitting } = this.props;
    const mappedUsers = this.props.allUsers.map(user => {
      return [user.name, user.email];
    });
    const users = generateMenuOptions(mappedUsers);
    console.log("Our Users", users);

    //const currentUsers = [{userName: "Syd Botz", id: 1}, {userName: "Veronica Blackwell", id: 2}, {userName: "Wanchen Yao", id: 3}];

    return (
      <Dialog open={open} maxWidth={"sm"}>
        <DialogTitle
          style={{
            paddingBottom: "8px"
          }}
          data-testid="caseNoteDialogTitle"
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
            variant="body2"
            style={{
              marginBottom: "24px"
            }}
          >
            Use this form to log any external correspondences or actions that
            take place outside of the Complaint Manager System. Your name will
            automatically be recorded.
          </Typography>
          <form>
            <DateField
              required
              name={"actionTakenAt"}
              inputProps={{
                type: "datetime-local",
                "data-testid": "dateAndTimeInput"
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
              name="caseNoteActionId"
              component={Dropdown}
              label={"Action Taken"}
              data-testid="actionsDropdown"
              style={{
                width: "75%",
                marginBottom: "16px"
              }}
              inputProps={{ "data-testid": "actionTakenInput" }}
              validate={[actionIsRequired]}
            >
              {generateMenuOptions(this.props.caseNoteActions)}
            </Field>
            <Field
              name="notes"
              label="Notes"
              component={TextFieldWithUserMention}
              inputProps={{
                "data-testid": "notesInput"
              }}
              InputLabelProps={{
                shrink: true
              }}
              multiline
              rowsMax={8}
              placeholder="Enter any notes about this action"
              fullWidth
              props={{ users: generateMenuOptions(mappedUsers) }}
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
            data-testid="cancelButton"
            onClick={() => {
              this.props.reset("CaseNotes");
              this.props.closeCaseNoteDialog();
            }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-testid="submitButton"
            onClick={handleSubmit(this.submit)}
            disabled={submitting}
          >
            {dialogType === "Add" ? "Add Case Note" : "Save"}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const ConnectedForm = reduxForm({
  form: CASE_NOTE_FORM_NAME
})(CaseNoteDialog);

const mapStateToProps = state => ({
  open: state.ui.caseNoteDialog.open,
  caseId: state.currentCase.details.id,
  dialogType: state.ui.caseNoteDialog.dialogType,
  initialCaseNote: state.ui.caseNoteDialog.initialCaseNote,
  caseNoteActions: state.ui.caseNoteActions,
  allUsers: state.users.all
});

const mapDispatchToProps = {
  getCaseNoteActionDropdownValues,
  addCaseNote,
  editCaseNote,
  reset,
  closeCaseNoteDialog,
  getUsers: getUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedForm);
