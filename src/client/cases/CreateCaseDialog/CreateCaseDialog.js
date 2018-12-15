import React from "react";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from "@material-ui/core";
import ComplaintTypeRadioGroup from "./ComplainantTypeRadioGroup";
import moment from "moment";
import DateField from "../sharedFormComponents/DateField";
import CivilianComplainantFields from "./CivilianComplainantFields";
import {
  CIVILIAN_INITIATED,
  DEFAULT_INTAKE_SOURCE
} from "../../../sharedUtilities/constants";
import { intakeSourceMenu } from "../../utilities/generateMenus";
import NoBlurTextField from "../CaseDetails/CivilianDialog/FormSelect";
import { intakeSourceIsRequired } from "../../formFieldLevelValidations";
import CreateCaseActions from "./CreateCaseActions";

class CreateCaseDialog extends React.Component {
  render () {
    const { handleSubmit, complaintType, open } = this.props;
    const civilianComplainant = complaintType === CIVILIAN_INITIATED;
    return (
      <Dialog data-test="createCaseDialog" open={open} fullWidth>
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
            <Timeline/>
            <br/>
            <Field
              name="case.complaintType"
              component={ComplaintTypeRadioGroup} />
            <br/>
            {civilianComplainant && <CivilianComplainantFields/>}
            <IntakeSource/>
          </form>
        </DialogContent>
        <CreateCaseActions
          civilianComplainant={civilianComplainant}
          handleSubmit={handleSubmit}/>
      </Dialog>
    )
  }
}

const Timeline = () =>
  <>
    <Typography variant="body2" style={{ marginBottom: "8px" }}>
      Timeline
    </Typography>
    <DateField
      required
      name="case.firstContactDate"
      label="First Contacted IPM"
      data-test="firstContactDateField"
      inputProps={{
        "data-test": "firstContactDateInput",
        type: "date",
        max: moment(Date.now()).format("YYYY-MM-DD")
      }}
      style={{
        marginRight: "5%", marginBottom: "3%",
        minWidth: "145px", width: "35%",
        clipPath: "inset(0 17px 0 0)"
      }}
    />
  </>

const IntakeSource = () =>
  <Field
    required
    name="case.intakeSource"
    component={NoBlurTextField}
    label="Intake Source"
    hinttext="Intake Source"
    data-test="intakeSourceDropdown"
    style={{ width: "50%" }}
    validate={[intakeSourceIsRequired]}
  >
    {intakeSourceMenu}
  </Field>

const mapStateToProps = state => ({
  open: state.ui.createCaseDialog.open,
  complaintType: formValueSelector("CreateCase")(state, 'case.complaintType')
})

const ConnectedDialog = connect(mapStateToProps)(CreateCaseDialog);

export default reduxForm({
  form: "CreateCase",
  initialValues: {
    case: {
      complaintType: CIVILIAN_INITIATED,
      firstContactDate: moment(Date.now()).format("YYYY-MM-DD"),
      intakeSource: DEFAULT_INTAKE_SOURCE
    }
  }
})(ConnectedDialog);
