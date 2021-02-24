import React from "react";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  withStyles
} from "@material-ui/core";
import ComplaintTypeRadioGroup from "./ComplainantTypeRadioGroup";
import moment from "moment";
import DateField from "../sharedFormComponents/DateField";
import CivilianComplainantFields from "./CivilianComplainantFields";
import {
  CIVILIAN_INITIATED,
  CREATE_CASE_FORM_NAME
} from "../../../../sharedUtilities/constants";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import Dropdown from "../../../common/components/Dropdown";
import { intakeSourceIsRequired } from "../../../formFieldLevelValidations";
import CreateCaseActions from "./CreateCaseActions";
import getIntakeSourceDropdownValues from "../../intakeSources/thunks/getIntakeSourceDropdownValues";
import { formatAddressAsString } from "../../utilities/formatAddress";
import { scrollToFirstErrorWithValue } from "../../../common/helpers/scrollToFirstError";
import { FIRST_CONTACTED_ORGANIZATION } from "../../../../instance-files/constants";

const styles = {
  dialogPaper: {
    minWidth: "40%"
  }
};

class CreateCaseDialog extends React.Component {
  componentDidMount() {
    this.props.dispatch(getIntakeSourceDropdownValues());
  }

  render() {
    const {
      handleSubmit,
      complaintType,
      open,
      submitting,
      classes
    } = this.props;
    const civilianComplainant = complaintType === CIVILIAN_INITIATED;

    return (
      <Dialog
        data-testid="createCaseDialog"
        classes={{ paper: classes.dialogPaper }}
        open={open}
        fullWidth
      >
        <DialogTitle
          data-testid="createCaseDialogTitle"
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
          <form data-testid="createCaseForm">
            <Timeline />
            <IntakeSource intakeSources={this.props.intakeSources} />
            <br />
            <Field
              name="case.complaintType"
              component={ComplaintTypeRadioGroup}
            />
            <br />
            {civilianComplainant && (
              <CivilianComplainantFields
                formattedAddress={this.props.formattedAddress}
                formName={CREATE_CASE_FORM_NAME}
              />
            )}
          </form>
        </DialogContent>
        <CreateCaseActions
          complaintType={complaintType}
          handleSubmit={handleSubmit}
          disabled={submitting}
          change={this.props.change}
        />
      </Dialog>
    );
  }
}

const Timeline = () => (
  <>
    <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
      Timeline
    </Typography>
    <DateField
      required
      name="case.firstContactDate"
      label={FIRST_CONTACTED_ORGANIZATION}
      data-testid="firstContactDateField"
      inputProps={{
        "data-testid": "firstContactDateInput",
        type: "date",
        max: moment(Date.now()).format("YYYY-MM-DD"),
        autoComplete: "off"
      }}
      style={{
        marginRight: "5%",
        marginBottom: "3%",
        minWidth: "145px",
        width: "35%"
      }}
    />
  </>
);

const IntakeSource = props => {
  return (
    <Field
      required
      name="case.intakeSourceId"
      component={Dropdown}
      label="Intake Source"
      hinttext="Intake Source"
      data-testid="intakeSourceDropdown"
      style={{ width: "50%" }}
      inputProps={{ "data-testid": "intakeSourceInput", autoComplete: "off" }}
      validate={[intakeSourceIsRequired]}
    >
      {generateMenuOptions(props.intakeSources)}
    </Field>
  );
};

const mapStateToProps = state => {
  const selector = formValueSelector(CREATE_CASE_FORM_NAME);
  const addressValues = selector(
    state,
    "address.streetAddress",
    "address.intersection",
    "address.city",
    "address.state",
    "address.zipCode",
    "address.country",
    "address.lat",
    "address.lng",
    "address.placeId"
  );
  const complaintTypeValues = selector(state, "case.complaintType");

  return {
    open: state.ui.createDialog.case.open,
    complaintType: complaintTypeValues,
    intakeSources: state.ui.intakeSources,
    formattedAddress: formatAddressAsString(addressValues.address),
    addressValid: state.ui.addressInput.addressValid
  };
};

const ConnectedDialog = connect(mapStateToProps)(
  withStyles(styles)(CreateCaseDialog)
);

export default reduxForm({
  form: CREATE_CASE_FORM_NAME,
  onSubmitFail: scrollToFirstErrorWithValue,
  initialValues: {
    case: {
      complaintType: CIVILIAN_INITIATED,
      firstContactDate: moment(Date.now()).format("YYYY-MM-DD")
    }
  }
})(ConnectedDialog);
