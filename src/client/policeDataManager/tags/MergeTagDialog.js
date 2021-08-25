import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { caseTagRequired } from "../../formFieldLevelValidations";
import {
  PrimaryButton,
  SecondaryButton
} from "../shared/components/StyledButtons";
import Dropdown from "../../common/components/Dropdown";
import { generateMenuOptions } from "../utilities/generateMenuOptions";
import getTagsWithCount from "./thunks/getTagsWithCount";
import { snackbarError } from "../actionCreators/snackBarActionCreators";

const MergeTagDialog = props => {
  const submit = async values => {
    try {
      await axios.patch(`api/tags/${props.tag.id}`, {
        mergeTagId: values.mergeTag
      });
      props.getTagsWithCount();
      props.closeDialog();
    } catch (error) {
      console.error(error);
      props.snackbarError(error.message);
    }
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle>Merge Tag</DialogTitle>
      <form onSubmit={props.handleSubmit(submit)}>
        <DialogContent>
          I want any complaint using this tag to use this instead:
          <Field
            inputProps={{
              "data-testid": "select-merge-tag-dropdown"
            }}
            component={Dropdown}
            name="mergeTag"
            required
            style={{ width: "100%" }}
            validate={[caseTagRequired]}
          >
            {generateMenuOptions(
              props.tags
                .filter(tag => tag.id !== props.tag.id)
                .map(tag => [tag.name, tag.id])
            )}
          </Field>
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "space-between", margin: "5px 15px" }}
        >
          <SecondaryButton
            data-testid="mergeTagCancelButton"
            onClick={props.closeDialog}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-testid="mergeTagSubmitButton"
            onClick={() => {}}
            disabled={!props.isFormValid}
          >
            Merge Tag
          </PrimaryButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

MergeTagDialog.defaultProps = {
  open: true
};

MergeTagDialog.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool,
  tag: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })
};

export default connect(
  state => ({
    tags: state.ui.tags,
    isFormValid: !state?.form[Object.keys(state.form)[0]]?.syncErrors
  }),
  { getTagsWithCount, snackbarError }
)(
  reduxForm({
    fields: ["mergeTag"]
  })(MergeTagDialog)
);
