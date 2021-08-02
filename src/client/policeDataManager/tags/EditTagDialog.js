import React, { useMemo } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
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

const submit = () => {}; // TODO

const EditTagDialog = props => {
  const tagAlreadyExist = useMemo(
    () => value =>
      props.existingTags?.filter(
        tag => tag?.name?.toUpperCase() === value?.toUpperCase()
      ).length
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
            name="tagName"
            validate={tagAlreadyExist}
          />
        </DialogContent>
        <DialogActions>
          <SecondaryButton
            data-testid="editTagCancelButton"
            onClick={props.cancel}
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
  initialValues: { tagName: props.tag.name },
  existingTags: state.ui.tags,
  value: state?.form?.EditTagForm?.values?.tagName
});

export default connect(mapStateToProps)(
  reduxForm({ form: "EditTagForm" })(EditTagDialog)
);
