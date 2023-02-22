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
import { CHANGE_COMPLAINT_TYPE_FORM_NAME } from "../../../../../sharedUtilities/constants";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import { usernameRequired } from "../../../../formFieldLevelValidations";
import getComplaintTypes from "../../../admin/thunks/getComplaintTypes";
//import getTagDropdownValues from "../../../tags/thunks/getTagDropdownValues";
import Dropdown from "../../../../common/components/Dropdown";

class ChangeComplaintTypeDialog extends Component {
  componentDidUpdate() {
    if (
      this.props.chooseComplaintTypeFeatureFlag &&
      this.props.complaintTypes.length === 0
    ) {
      this.props.getComplaintTypes();
    }
  }

  submit = values => {
    let caseDetailsCopy = { ...this.props.caseDetails };
    caseDetailsCopy.complaintType = this.props.currentValue;
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
          data-testid="ChangeComplaintTypeDialogTitle"
        >
          Complaint Type
        </DialogTitle>
        <DialogContent>
          <form onSubmit={event => event.preventDefault()}>
            <Field
              inputProps={{
                "data-testid": "complaintDropdownInput"
              }}
              component={Dropdown}
              name="user"
              required
              style={{ width: "20rem" }}
              validate={[usernameRequired]}
            >
              {this.props.complaintTypes
                ? generateMenuOptions(
                    this.props.complaintTypes.map(type => type.name)
                  )
                : this.props.getComplaintTypes()}
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
            data-testid="changeComplaintTypeCancelButton"
            onClick={() => {
              this.props.setDialog(false);
              this.props.reset(CHANGE_COMPLAINT_TYPE_FORM_NAME);
            }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-testid="changeComplaintTypeSubmitButton"
            onClick={handleSubmit(this.submit)}
            disabled={
              this.props.currentValue === this.props.caseDetails.complaintType
            }
          >
            Set Complaint Type
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const ChangeComplaintTypeDialogForm = reduxForm({
  form: CHANGE_COMPLAINT_TYPE_FORM_NAME
})(ChangeComplaintTypeDialog);

const mapStateToProps = (state, props) => {
  return {
    chooseComplaintTypeFeatureFlag: state.featureToggles.chooseComplaintType,
    complaintTypes: state.ui.complaintTypes,
    initialValues: { user: props.caseDetails.assignedTo },
    currentValue: formValueSelector(CHANGE_COMPLAINT_TYPE_FORM_NAME)(
      state,
      "user"
    )
  };
};

const mapDispatchToProps = {
  updateCase,
  reset,
  getComplaintTypes
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeComplaintTypeDialogForm);
