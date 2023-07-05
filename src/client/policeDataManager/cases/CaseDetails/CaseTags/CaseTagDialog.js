import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, reset } from "redux-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { CASE_TAG_FORM_NAME } from "../../../../../sharedUtilities/constants";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import createCaseTag from "../../thunks/createCaseTag";
import { caseTagRequired } from "../../../../formFieldLevelValidations";
import getTagDropdownValues from "../../../tags/thunks/getTagDropdownValues";
import CreatableDropdown from "../../../../common/components/CreatableDropdown";

class CaseTagDialog extends Component {
  componentDidMount() {
    this.props.getTagDropdownValues();
  }

  submit = values => {
    const { caseId, closeDialog } = this.props;
    this.props.createCaseTag(values, caseId);
    this.props.reset(CASE_TAG_FORM_NAME);
    closeDialog();
  };

  render() {
    const { open, submitting, handleSubmit, closeDialog } = this.props;

    const isTagSelected =
      !!this.props.selectedTag && this.props.selectedTag.label !== "";

    return (
      <Dialog open={open}>
        <DialogTitle
          style={{
            paddingBottom: "8px"
          }}
          data-testid="caseTagDialogTitle"
        >
          Add New Tag
        </DialogTitle>
        <DialogContent>
          <Typography
            type="body2"
            style={{
              marginBottom: "24px"
            }}
          >
            Search for and select an existing tag or create a new one.
          </Typography>
          <form onSubmit={event => event.preventDefault()}>
            <Field
              inputProps={{
                "data-testid": "caseTagDropdownInput"
              }}
              data-testid="caseTagDropdown"
              component={CreatableDropdown}
              name="caseTagValue"
              required
              style={{ width: "12rem" }}
              validate={[caseTagRequired]}
            >
              {generateMenuOptions(
                this.props.tags.map(tag => [tag.name, tag.id])
              )}
            </Field>
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
            data-testid="caseTagCancelButton"
            onClick={() => {
              closeDialog();
              this.props.reset(CASE_TAG_FORM_NAME);
            }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-testid="caseTagSubmitButton"
            onClick={handleSubmit(this.submit)}
            disabled={submitting || !isTagSelected}
          >
            Add Tag
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const CaseTagDialogForm = reduxForm({
  form: CASE_TAG_FORM_NAME
})(CaseTagDialog);

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  tags: state.ui.tags,
  selectedTag:
    state.form.CaseTagForm &&
    state.form.CaseTagForm.values &&
    state.form.CaseTagForm.values.caseTagValue
});

const mapDispatchToProps = {
  createCaseTag,
  getTagDropdownValues,
  reset
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseTagDialogForm);
