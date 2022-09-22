import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  withStyles
} from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import {
  defaultSenderNotBlank,
  defaultSenderRequired,
  letterTypeNotBlank,
  letterTypeRequired,
  statusNotBlank,
  statusRequired
} from "../../../formFieldLevelValidations";
import { renderTextField } from "../../cases/sharedFormComponents/renderFunctions";
import PrimaryCheckBox from "../../shared/components/PrimaryCheckBox";
import Dropdown from "../../../common/components/Dropdown";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import { RichTextEditorComponent } from "../../shared/components/RichTextEditor/RichTextEditor";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import {
  snackbarSuccess,
  snackbarError
} from "../../actionCreators/snackBarActionCreators";
import axios from "axios";

const styles = {
  paper: { height: "80%" }
};

const LetterTypeDialog = props => {
  const submit = values => {
    axios
      .put(`/api/letter-types/${props.letterType.id}`, {
        type: values.letterTypeInput,
        template: values.template,
        hasEditPage: values.hasEditPage,
        requiresApproval: values.requiresApproval,
        defaultSender: values.defaultSender,
        requiredStatus: values.requiredStatus,
        editableTemplate: values.hasEditPage
          ? values.editableTemplate
          : undefined
      })
      .then(result => {
        props.snackbarSuccess("Successfully edited letter type");
        props.exit(); // TODO get admin page to show changes
      })
      .catch(error => {
        props.snackbarError("Failed to edit letter type");
        console.error(error);
      });
  };

  return (
    <Dialog open={true} classes={props.classes}>
      <form
        onSubmit={props.handleSubmit(submit)}
        role="form"
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <DialogTitle>Edit Letter Type</DialogTitle>
        <DialogContent>
          <section
            className="input-section"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "14em"
            }}
          >
            <Field
              component={renderTextField}
              inputProps={{ "data-testid": "letter-type-input" }}
              name="letterTypeInput"
              placeholder="Letter Type"
              validate={[letterTypeRequired, letterTypeNotBlank]}
            />
            <FormControlLabel
              label="Requires Approval"
              control={
                <Field
                  component={PrimaryCheckBox}
                  inputProps={{ "data-testid": "requires-approval-checkbox" }}
                  name="requiresApproval"
                />
              }
            />
            <FormControlLabel
              label="Is Editable"
              control={
                <Field
                  component={PrimaryCheckBox}
                  inputProps={{ "data-testid": "edit-page-checkbox" }}
                  name="hasEditPage"
                />
              }
            />
            <Field
              component={Dropdown}
              inputProps={{ "data-testid": "default-sender-dropdown" }}
              name="defaultSender"
              placeholder="Default Sender"
              required
              validate={[defaultSenderRequired, defaultSenderNotBlank]}
              style={{ width: "100%" }}
            >
              {
                generateMenuOptions([
                  ["Billy", "bill@billy.bil"],
                  ["ABC Pest and Lawn", "abcpestandlawn@gmail.com"]
                ]) /* TODO get from server */
              }
            </Field>
            <Field
              component={Dropdown}
              inputProps={{ "data-testid": "required-status-dropdown" }}
              name="requiredStatus"
              placeholder="requiredStatus"
              required
              validate={[statusRequired, statusNotBlank]}
              style={{ width: "100%" }}
            >
              {
                generateMenuOptions([
                  "Active",
                  "Closed"
                ]) /* TODO get from server */
              }
            </Field>
            <label
              style={{
                margin: "10px 0px"
              }}
              htmlFor="template-field"
            >
              Template
            </label>

            <Field
              name="template"
              label="Template"
              id="template-field"
              component={RichTextEditorComponent}
              placeholder="Enter Letter Template"
              fullWidth
              multiline
              rowsMax={20}
              rows={5}
              style={{
                color: "black"
              }}
            />
            {props.editable ? (
              <>
                <label
                  style={{
                    margin: "10px 0px"
                  }}
                  htmlFor="body-template-field"
                >
                  Body Template
                </label>
                <Field
                  name="editableTemplate"
                  label="Editable Template"
                  id="body-template-field"
                  component={RichTextEditorComponent}
                  placeholder="Enter Letter Editable Template"
                  fullWidth
                  multiline
                  rowsMax={20}
                  rows={5}
                  style={{
                    color: "black"
                  }}
                />
              </>
            ) : (
              ""
            )}
          </section>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={props.exit}>Cancel</SecondaryButton>
          <PrimaryButton data-testid="saveButton">Save</PrimaryButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default connect(
  (state, props) => {
    return {
      editable: state.form.letterTypeForm?.values?.hasEditPage,
      initialValues: {
        letterTypeInput: props.letterType.type,
        requiresApproval: props.letterType.requiresApproval,
        hasEditPage: props.letterType.hasEditPage,
        defaultSender: props.letterType.defaultSender.nickname,
        requiredStatus: props.letterType.requiredStatus.name,
        template: props.letterType.template,
        editableTemplate: props.letterType.editableTemplate
      }
    };
  },
  { snackbarSuccess, snackbarError }
)(reduxForm({ form: "letterTypeForm" })(withStyles(styles)(LetterTypeDialog)));
