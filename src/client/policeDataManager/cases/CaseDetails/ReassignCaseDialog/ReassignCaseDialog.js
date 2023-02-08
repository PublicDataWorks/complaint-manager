import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
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
import updateCase from "../../thunks/updateCase";
import { REASSIGN_CASE_FORM_NAME } from "../../../../../sharedUtilities/constants";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import { usernameRequired } from "../../../../formFieldLevelValidations";
//import getTagDropdownValues from "../../../tags/thunks/getTagDropdownValues";
import Dropdown from "../../../../common/components/Dropdown";

class ReassignCaseDialog extends Component {
  submit = values => {
    let caseDetailsCopy = { ...this.props.caseDetails };
    caseDetailsCopy.assignedTo = this.props.currentValue;
    this.props.updateCase(caseDetailsCopy);
    this.props.setDialog(false);
  };
  render() {
    const { open, handleSubmit } = this.props;

    return (
      <Dialog open={open}>
        <DialogTitle
          style={{
            paddingBottom: "8px"
          }}
          data-testid="ReassignCaseDialogTitle"
        >
          Assign User
        </DialogTitle>
        <DialogContent>
          <form onSubmit={event => event.preventDefault()}>
            <Field
              inputProps={{
                "data-testid": "userDropdownInput"
              }}
              component={Dropdown}
              name="user"
              required
              style={{ width: "20rem" }}
              validate={[usernameRequired]}
            >
              {generateMenuOptions(
                this.props.users.map(user => [user.name, user.email])
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
            data-testid="reassignCaseCancelButton"
            onClick={() => {
              this.props.setDialog(false);
              this.props.reset(REASSIGN_CASE_FORM_NAME);
            }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-testid="assignedToSubmitButton"
            onClick={handleSubmit(this.submit)}
            disabled={
              this.props.currentValue === this.props.caseDetails.assignedTo
            }
          >
            Assign User
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const ReassignCaseDialogForm = reduxForm({
  form: REASSIGN_CASE_FORM_NAME
})(ReassignCaseDialog);

const mapStateToProps = (state, props) => {
  return {
    users: state.users.all,
    initialValues: { user: props.caseDetails.assignedTo },
    currentValue: formValueSelector(REASSIGN_CASE_FORM_NAME)(state, "user")
  };
};

const mapDispatchToProps = {
  updateCase,
  reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReassignCaseDialogForm);
