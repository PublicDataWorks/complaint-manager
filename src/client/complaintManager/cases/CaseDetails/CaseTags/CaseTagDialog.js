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
import { closeCaseTagDialog } from "../../../actionCreators/casesActionCreators";
import { CASE_TAG_FORM_NAME } from "../../../../../sharedUtilities/constants";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import createCaseTag from "../../thunks/createCaseTag";
import DropdownSelect from "../CivilianDialog/DropdownSelect";
import { caseTagRequired } from "../../../../formFieldLevelValidations";
import getTagDropdownValues from "../../../tags/thunks/getTagDropdownValues";
import Dropdown from "../../../../common/components/Dropdown";

class CaseTagDialog extends Component {
  componentDidMount() {
    this.props.getTagDropdownValues();
  }

  submit = values => {
    const { caseId } = this.props;

    this.props.createCaseTag(values, caseId);
    this.props.reset(CASE_TAG_FORM_NAME);
  };

  render() {
    const { open, submitting, handleSubmit } = this.props;

    const isTagSelected = !!this.props.selectedTag;

    return (
      <Dialog open={open}>
        <DialogTitle
          style={{
            paddingBottom: "8px"
          }}
          data-test="caseTagDialogTitle"
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
          <form>
            <Field
              name="caseTagValue"
              component={Dropdown}
              data-test="caseTagDropdown"
              style={{ width: "12rem" }}
              disableClearable={true}
              required
              validate={[caseTagRequired]}
              freeSolo={true}
            >
              {generateMenuOptions(this.props.tags)}
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
            data-test="caseTagCancelButton"
            onClick={() => {
              this.props.closeCaseTagDialog();
              this.props.reset(CASE_TAG_FORM_NAME);
            }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-test="caseTagSubmitButton"
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
  open: state.ui.caseTagDialog.open,
  caseId: state.currentCase.details.id,
  tags: state.ui.tags,
  selectedTag:
    state.form.CaseTagForm &&
    state.form.CaseTagForm.values &&
    state.form.CaseTagForm.values.caseTagValue
});

const mapDispatchToProps = {
  closeCaseTagDialog,
  createCaseTag,
  getTagDropdownValues,
  reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseTagDialogForm);
