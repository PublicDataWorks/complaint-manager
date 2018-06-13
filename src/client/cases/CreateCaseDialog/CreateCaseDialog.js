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
} from "@material-ui/core";
import { withTheme } from "@material-ui/core/styles";
import ComplainantTypeRadioGroup from "./ComplainantTypeRadioGroup";
import createCase from "../thunks/createCase";
import { closeSnackbar } from "../../actionCreators/snackBarActionCreators";
import moment from "moment";
import DateField from "../sharedFormComponents/DateField";
import { atLeastOneRequired } from "../../formValidations";
import { applyCentralTimeZoneOffset } from "../../utilities/formatDate";
import CivilianComplainantFields from "./CivilianComplainantFields";
import CivilianComplainantButtons from "./CivilianComplainantButtons";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import {closeCreateCaseDialog, openCreateCaseDialog} from "../../actionCreators/casesActionCreators";

const margin = {
  marginLeft: "5%",
  marginTop: "2%",
  marginBottom: "2%"
};

const offSet = { marginRight: "5%", marginBottom: "3%" };

class CreateCaseDialog extends React.Component {
  state = {
    civilianComplainant: true
  };

  openDialog = () => {
    this.props.dispatch(openCreateCaseDialog())
    this.props.dispatch(closeSnackbar());
    this.setCivilianComplainantType()
  };

  closeDialog = () => {
    this.props.dispatch(closeCreateCaseDialog())
    this.props.dispatch(reset("CreateCase"));
  };

  setOfficerComplainantType = () => {
    this.setState({ civilianComplainant: false });
  };

  setCivilianComplainantType = () => {
    this.setState({ civilianComplainant: true });
  };

  createAndView = (values, dispatch) => {
    const creationDetails = {
      caseDetails: {
        case: this.prepareCaseValues(values),
        civilian: this.prepareCivilianValues(values)
      },
      redirect: true
    };

    dispatch(createCase(creationDetails));
  };

  createOnly = (values, dispatch) => {
    const creationDetails = {
      caseDetails: {
        case: this.prepareCaseValues(values),
        civilian: this.prepareCivilianValues(values)
      },
      redirect: false
    };

    dispatch(createCase(creationDetails));
  };

  createAndSearch = (values, dispatch) => {
    const creationDetails = {
      caseDetails: {
        case: this.prepareCaseValues(values)
      },
      redirect: true
    };

    dispatch(createCase(creationDetails));
  };

  prepareCaseValues = values => ({
    ...values.case,
    incidentDate: applyCentralTimeZoneOffset(values.case.incidentDate)
  });

  prepareCivilianValues = values => ({
    ...values.civilian,
    firstName: values.civilian.firstName.trim(),
    lastName: values.civilian.lastName.trim()
  });

  render() {
    const { theme, handleSubmit } = this.props;
    const createCaseOnly = handleSubmit(this.createOnly);
    const createAndView = handleSubmit(this.createAndView);
    const createAndSearch = handleSubmit(this.createAndSearch);

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
          open={this.props.open}
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
                setOfficerComplainantType={this.setOfficerComplainantType}
                setCivilianComplainantType={this.setCivilianComplainantType}
              />
              <br />
              {this.state.civilianComplainant ? (
                <CivilianComplainantFields />
              ) : null}
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
            {this.state.civilianComplainant ? (
              <CivilianComplainantButtons
                createCaseOnly={createCaseOnly}
                createAndView={createAndView}
              />
            ) : (
              <PrimaryButton
                data-test="createAndSearch"
                onClick={createAndSearch}
              >
                Create and Search
              </PrimaryButton>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    open: state.ui.createCaseDialog.open
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
