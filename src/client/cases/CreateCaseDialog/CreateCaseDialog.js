import React from "react";
import { Field, reduxForm, reset } from "redux-form";
import { connect } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from "material-ui";
import {
  SecondaryButton,
  PrimaryButton
} from "../../shared/components/StyledButtons";
import { withTheme } from "material-ui/styles";
import FirstNameField from "../sharedFormComponents/FirstNameField";
import LastNameField from "../sharedFormComponents/LastNameField";
import PhoneNumberField from "../sharedFormComponents/PhoneNumberField";
import EmailField from "../sharedFormComponents/EmailField";
import LinkButton from "../../shared/components/LinkButton";
import ComplainantTypeRadioGroup from "./ComplainantTypeRadioGroup";
import createCase from "../thunks/createCase";
import { closeSnackbar } from "../../actionCreators/snackBarActionCreators";
import moment from "moment";
import DateField from "../sharedFormComponents/DateField";
import MiddleInitialField from "../sharedFormComponents/MiddleInitialField";
import SuffixField from "../sharedFormComponents/SuffixField";
import { atLeastOneRequired } from "../../formValidations";
import { applyCentralTimeZoneOffset } from "../../utilities/formatDate";

const margin = {
  marginLeft: "5%",
  marginTop: "2%",
  marginBottom: "2%"
};

const offSet = { marginRight: "5%", marginBottom: "3%" };

class CreateCaseDialog extends React.Component {
  state = {
    dialogOpen: false
  };

  componentWillReceiveProps = nextProps => {
    if (!this.props.caseCreationSuccess && nextProps.caseCreationSuccess) {
      this.closeDialog();
    }
  };

  openDialog = () => {
    this.setState({ dialogOpen: true });
    this.props.dispatch(closeSnackbar());
  };

  closeDialog = () => {
    this.setState({ dialogOpen: false });
    this.props.dispatch(reset("CreateCase"));
  };

  createAndView = (values, dispatch) => {
    const creationDetails = {
      caseDetails: this.prepareCaseDetails(values),
      redirect: true
    };

    dispatch(createCase(creationDetails));
  };

  createOnly = (values, dispatch) => {
    const creationDetails = {
      caseDetails: this.prepareCaseDetails(values),
      redirect: false
    };

    dispatch(createCase(creationDetails));
  };

  prepareCaseDetails = values => ({
    case: {
      ...values.case,
      createdBy: this.props.currentUser,
      assignedTo: this.props.currentUser,
      incidentDate: applyCentralTimeZoneOffset(values.case.incidentDate)
    },
    civilian: {
      ...values.civilian,
      firstName: values.civilian.firstName.trim(),
      lastName: values.civilian.lastName.trim()
    }
  });

  render() {
    const { theme, handleSubmit } = this.props;

    return (
      <div>
        <PrimaryButton
          data-test="createCaseButton"
          onClick={this.openDialog}
          style={margin}
        >
          Create New Case
        </PrimaryButton>
        <Dialog
          data-test="createCaseDialog"
          open={this.state.dialogOpen}
          fullWidth
        >
          <DialogTitle
            data-test="createCaseDialogTitle"
            style={{ paddingBottom: "1%" }}
          >
            Create New Case
          </DialogTitle>
          <DialogContent style={{ padding: "0px 24px" }}>
            <DialogContentText style={{ paddingBottom: "3%" }}>
              <Typography variant="caption">
                Enter as much information as available to start a case. You will
                be able to edit this information later.
              </Typography>
            </DialogContentText>
            <form data-test="createCaseForm">
              <Typography variant="body2" style={{ marginBottom: "8px" }}>
                Timeline
              </Typography>
              <DateField
                required={true}
                name="case.firstContactDate"
                label="First Contact Date"
                data-test="firstContactDateField"
                inputProps={{
                  "data-test": "firstContactDateInput",
                  type: "date",
                  max: moment(Date.now()).format("YYYY-MM-DD")
                }}
                style={{
                  ...offSet,
                  minWidth: "145px",
                  width: "35%",
                  clipPath: "inset(0 17px 0 0)"
                }}
              />
              <br />
              <Field
                name="case.complainantType"
                component={ComplainantTypeRadioGroup}
              />
              <br />
              <FirstNameField name="civilian.firstName" />
              <MiddleInitialField
                name="civilian.middleInitial"
                style={{
                  width: "40px",
                  marginRight: "5%"
                }}
              />
              <LastNameField name="civilian.lastName" />
              <SuffixField
                name="civilian.suffix"
                style={{
                  width: "120px"
                }}
              />
              <br />
              <PhoneNumberField name={"civilian.phoneNumber"} />
              <EmailField name={"civilian.email"} />
            </form>
          </DialogContent>
          <DialogActions
            style={{
              justifyContent: "space-between",
              margin: `${theme.spacing.unit * 2}px`
            }}
          >
            <SecondaryButton data-test="cancelCase" onClick={this.closeDialog}>
              Cancel
            </SecondaryButton>
            <div>
              <LinkButton
                data-test="createCaseOnly"
                onClick={handleSubmit(this.createOnly)}
                style={{ marginRight: "10px" }}
              >
                Create Only
              </LinkButton>
              <PrimaryButton
                data-test="createAndView"
                onClick={handleSubmit(this.createAndView)}
              >
                Create And View
              </PrimaryButton>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    caseCreationSuccess: state.ui.snackbar.success,
    currentUser: state.users.current.userInfo.nickname
  };
};

const validate = values => {
  const errorMessage = "Please enter phone number or email address";
  const fieldsToValidate = ["civilian.phoneNumber", "civilian.email"];
  return atLeastOneRequired(values, errorMessage, fieldsToValidate);
};

export const DialogWithTheme = withTheme()(CreateCaseDialog);
const ConnectedDialog = connect(mapStateToProps)(DialogWithTheme);

export default reduxForm({
  form: "CreateCase",
  initialValues: {
    case: {
      complainantType: "Civilian",
      firstContactDate: moment(Date.now()).format("YYYY-MM-DD")
    }
  },
  validate
})(ConnectedDialog);
