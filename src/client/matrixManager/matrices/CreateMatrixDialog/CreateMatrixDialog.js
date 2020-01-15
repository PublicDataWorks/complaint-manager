import { connect } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  withStyles
} from "@material-ui/core";
import { Field, formValueSelector, reduxForm } from "redux-form";
import React from "react";
import { CREATE_MATRIX_FORM_NAME } from "../../../../sharedUtilities/constants";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../complaintManager/shared/components/StyledButtons";
import { closeCreateDialog } from "../../../common/actionCreators/createDialogActionCreators";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";
import PIBControlField from "../../sharedFormComponents/PIBControlField";
import Dropdown from "../../../common/components/Dropdown";
import { generateMenuOptions } from "../../../complaintManager/utilities/generateMenuOptions";
import getUsers from "../thunks/getUsers";
import createMatrix from "../thunks/createMatrix";
import {
  firstReviewerRequired,
  reviewersShouldBeDifferent,
  secondReviewerRequired
} from "../../../formFieldLevelValidations";

const styles = theme => ({
  dialogPaper: {
    minWidth: "40%",
    maxWidth: "400px"
  },
  dialogAction: {
    justifyContent: "space-between",
    margin: `${theme.spacing(2)}px`
  }
});

class CreateMatrixDialog extends React.Component {
  componentDidMount() {
    this.props.getUsers();
  }

  closeDialog = () => {
    this.props.closeCreateDialog(DialogTypes.MATRIX);
    this.props.reset(CREATE_MATRIX_FORM_NAME);
  };

  createAndSearch = values => {
    this.props.createMatrix({
      pibControlNumber: values.pibControlNumber.toUpperCase(),
      firstReviewer: values.firstReviewer,
      secondReviewer: values.secondReviewer
    });
  };

  render() {
    const mappedUsers = this.props.allUsers.map(user => {
      return [user.name, user.email];
    });
    return (
      <Dialog
        data-test="create-matrix-dialog"
        classes={{ paper: this.props.classes.dialogPaper }}
        open={this.props.open}
        fullWidth
      >
        <DialogTitle
          data-test="create-matrix-dialog-title"
          style={{ paddingBottom: "1%" }}
        >
          Create New Matrix
        </DialogTitle>
        <DialogContent style={{ padding: "0px 24px" }}>
          <form data-test="create-matrix-form">
            <PIBControlField />
            <br />
            <Field
              inputProps={{
                "data-test": "firstReviewerInput"
              }}
              data-test="first-reviewer-dropdown"
              component={Dropdown}
              name="firstReviewer"
              label="First Reviewer"
              isCreatable={false}
              style={{ width: "12rem" }}
              required
              validate={[firstReviewerRequired]}
            >
              {generateMenuOptions(mappedUsers)}
            </Field>
            <br />
            <Field
              inputProps={{
                "data-test": "secondReviewerInput"
              }}
              data-test="second-reviewer-dropdown"
              component={Dropdown}
              name="secondReviewer"
              label="Second Reviewer"
              isCreatable={false}
              style={{ width: "12rem" }}
              required
              validate={[secondReviewerRequired, reviewersShouldBeDifferent]}
            >
              {generateMenuOptions(mappedUsers)}
            </Field>
          </form>
        </DialogContent>
        <DialogActions classes={{ root: this.props.classes.dialogAction }}>
          <SecondaryButton data-test="cancel-matrix" onClick={this.closeDialog}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-test="create-and-search"
            onClick={this.props.handleSubmit(this.createAndSearch)}
            disabled={this.props.submitting}
          >
            Create and Search
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => {
  const selector = formValueSelector(CREATE_MATRIX_FORM_NAME);
  const firstReviewer = selector(state, "firstReviewer");
  const secondReviewer = selector(state, "secondReviewer");
  return {
    open: state.ui.createDialog.matrix.open,
    allUsers: state.users.all,
    firstReviewer,
    secondReviewer
  };
};

const mapDispatchToProps = {
  closeCreateDialog: closeCreateDialog,
  createMatrix,
  getUsers: getUsers
};

const connectedForm = reduxForm({
  form: CREATE_MATRIX_FORM_NAME,
  initialValues: {
    firstReviewer: "",
    secondReviewer: ""
  }
})(CreateMatrixDialog);

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(connectedForm)
);
