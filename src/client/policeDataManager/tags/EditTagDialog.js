import React, { useState } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  TextField
} from "@material-ui/core";
import {
  SecondaryButton,
  PrimaryButton
} from "../shared/components/StyledButtons";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";

const EditTagDialog = props => {
  const tagAlreadyExist = value => {
    console.log("LOOK AT ME!!!!!");
    return props.existingTags.filter(tag => tag.name === value).length
      ? "The tag name you entered already exists"
      : undefined;
  };
  return (
    <Dialog
      open={props.open}
      classes={{
        paperWidthSm: props.classes.paperWidthSm
      }}
    >
      <form>
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>
          <Field
            component={renderTextField}
            inputProps={{
              "data-testid": "editTagTextBox"
            }}
            name="tagName"
            validate={tagAlreadyExist}
          />
        </DialogContent>
        <DialogActions>
          <SecondaryButton data-testid="editTagCancelButton">
            Cancel
          </SecondaryButton>
          <PrimaryButton data-testid="saveTagButton">Save Tag</PrimaryButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const mapStateToProps = (state, props) => ({
  initialValues: { tagName: props.tag.name },
  existingTags: state.ui.tags
});

export default connect(mapStateToProps)(
  reduxForm({ form: "EditTagForm" })(EditTagDialog)
);
