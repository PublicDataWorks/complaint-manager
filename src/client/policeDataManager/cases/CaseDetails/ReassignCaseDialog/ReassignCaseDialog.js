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
import { closeReassinCaseDialog } from "../../../actionCreators/casesActionCreators";
import { REASSIGN_CASE_FORM_NAME } from "../../../../../sharedUtilities/constants";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import getUsers from "../../../../common/thunks/getUsers";
import { usernameRequired } from "../../../../formFieldLevelValidations";
//import getTagDropdownValues from "../../../tags/thunks/getTagDropdownValues";
import Dropdown from "../../../../common/components/Dropdown";

class ReassignCaseDialog extends Component {
  //   componentDidMount() {
  //     this.props.getUsers();
  //   }

  submit = values => {
    const { caseId } = this.props;
    //this.props.createCaseTag(values, caseId);
    //this.props.reset(CASE_TAG_FORM_NAME);
  };

  render() {
    const { open, submitting, handleSubmit } = this.props;

    const isTagSelected =
      !!this.props.selectedTag && this.props.selectedTag.label !== "";

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
              style={{ width: "12rem" }}
              validate={[usernameRequired]}
            >
              {generateMenuOptions(this.props.users.map(user => user.email))}
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
              this.props.close();
              this.props.reset(REASSIGN_CASE_FORM_NAME);
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

const ReassignCaseDialogForm = reduxForm({
  form: REASSIGN_CASE_FORM_NAME
})(ReassignCaseDialog);

const mapStateToProps = state => ({
  users: state.users.all
});

const mapDispatchToProps = {
  // closeCaseTagDialog,
  // createCaseTag,
  // getTagDropdownValues,
  reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReassignCaseDialogForm);
