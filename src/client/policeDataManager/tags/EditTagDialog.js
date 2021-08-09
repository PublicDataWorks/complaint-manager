import React, { useState, useMemo } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import {
  SecondaryButton,
  PrimaryButton
} from "../shared/components/StyledButtons";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";
import getTagsWithCount from "./thunks/getTagsWithCount";
import { snackbarError } from "../actionCreators/snackBarActionCreators";

const EditTagDialog = props => {
  const submit = async values => {
    try {
      await axios.put(`api/tags/${props.tag.id}`, {
        id: props.tag.id,
        name: values.nameOfTag
      });
      props.getTagsWithCount();
      props.exit();
    } catch (error) {
      console.error(error);
      props.snackbarError(error.message);
    }
  };

  const tagAlreadyExist = useMemo(
    () => value =>
      props.existingTags?.filter(tag => tag?.name === value).length
        ? "The tag name you entered already exists"
        : undefined,
    [props.existingTags]
  );

  return (
    <Dialog
      open={props.open}
      classes={{
        paperWidthSm: props.classes.paperWidthSm
      }}
    >
      <form onSubmit={props.handleSubmit(submit)} role="form">
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>
          <Field
            component={renderTextField}
            inputProps={{
              "data-testid": "editTagTextBox"
            }}
            style={{ minWidth: "235px" }}
            name="nameOfTag"
            validate={tagAlreadyExist}
          />
        </DialogContent>
        <DialogActions>
          <SecondaryButton
            data-testid="editTagCancelButton"
            onClick={props.exit}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-testid="saveTagButton"
            disabled={
              !props.value ||
              props.value.trim() === "" ||
              props.tag.name === props.value ||
              !!tagAlreadyExist(props.value)
            }
          >
            Save Tag
          </PrimaryButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const mapStateToProps = (state, props) => ({
  initialValues: { nameOfTag: props.tag.name },
  existingTags: state.ui.tags,
  value: state?.form?.[`EditTagForm${props.tag.id}`]?.values?.nameOfTag
});

export default connect(mapStateToProps, { getTagsWithCount, snackbarError })(
  reduxForm({ fields: ["nameOfTag"] })(EditTagDialog)
);
