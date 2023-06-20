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
import { Field, reduxForm, reset } from "redux-form";
import DateField from "../../sharedFormComponents/DateField";
import Dropdown from "../../../../common/components/Dropdown";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import addCaseNote from "../../thunks/addCaseNote";
import { actionIsRequired } from "../../../../formFieldLevelValidations";
import timezone from "moment-timezone";
import moment from "moment";
import _ from "lodash";
import { CASE_NOTE_FORM_NAME } from "../../../../../sharedUtilities/constants";
import editCaseNote from "../../thunks/editCaseNote";
import getCaseNoteActionDropdownValues from "../../../caseNoteActions/thunks/getCaseNoteActionDropdownValues";
import { TextFieldWithUserMention } from "./TextFieldWithUserMention";
import getUsers from "../../../../common/thunks/getUsers";
import { filterAfterTrigger, keyDownEvent } from "./userMentionHelperFunctions";
import scrollToFirstError from "../../../../common/helpers/scrollToFirstError";
import { userTimezone } from "../../../../common/helpers/userTimezone";

class CaseNoteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mentionedUsers: []
    };
    this.handleMentionedUsers = this.handleMentionedUsers.bind(this);
  }

  componentDidMount() {
    this.props.getCaseNoteActionDropdownValues();
    this.props.getUsers();
  }

  handleMentionedUsers = mentionedUsers => {
    this.setState({
      mentionedUsers
    });
  };

  submit = values => {
    const {
      addCaseNote,
      caseId,
      closeDialog,
      dialogType,
      editCaseNote,
      initialCaseNote
    } = this.props;
    console.log(values);

    let valuesToSubmit = moment(values.actionTakenAt).isSame(
      initialCaseNote?.actionTakenAt
    )
      ? {
          ..._.omit(values, ["actionTakenAt"]),
          caseId,
          mentionedUsers: this.state.mentionedUsers
        }
      : {
          ...values,
          actionTakenAt: timezone
            .tz(values.actionTakenAt, userTimezone)
            .format(),
          caseId,
          mentionedUsers: this.state.mentionedUsers
        };
    console.log("like halfway down the submit function");
    switch (dialogType) {
      case "Add":
        addCaseNote(valuesToSubmit);
        break;
      case "Edit":
        editCaseNote(valuesToSubmit);
        break;
      default:
        break;
    }

    closeDialog();
  };

  displayUserDropdown = (value, cursorPosition) => {
    const indexOfFirstMention = value.indexOf("@");
    return value.includes("@") && cursorPosition > indexOfFirstMention;
  };

  render() {
    const { open, handleSubmit, dialogType, submitting } = this.props;
    const mappedUsers = this.props.allUsers.map(user => {
      return [user.name, user.email];
    });

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
          <form onSubmit={event => event.preventDefault()}>
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
              data-testid="notes"
              name="notes"
              label="Notes"
              component={TextFieldWithUserMention}
              inputProps={{
                "data-testid": "notesInput"
              }}
              InputLabelProps={{
                shrink: true
              }}
              users={generateMenuOptions(mappedUsers)}
              filterAfterMention={filterAfterTrigger}
              onSetMentionedUsers={this.handleMentionedUsers}
              displayUserDropdown={this.displayUserDropdown}
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
              this.props.closeDialog();
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

const mapStateToProps = (state, props) => ({
  caseId: state.currentCase.details.id,
  caseNoteActions: state.ui.caseNoteActions,
  allUsers: state.users.all
});

const mapDispatchToProps = {
  getCaseNoteActionDropdownValues,
  addCaseNote,
  editCaseNote,
  reset,
  getUsers: getUsers
};

const connectedForm = reduxForm({
  form: CASE_NOTE_FORM_NAME,
  onSubmitFail: scrollToFirstError,
  initialValue: {
    notes: "initial value"
  }
})(CaseNoteDialog);

export default connect(mapStateToProps, mapDispatchToProps)(connectedForm);
