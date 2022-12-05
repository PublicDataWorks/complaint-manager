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
  CONFIGS,
  CREATE_CASE_FORM_NAME,
  ISO_DATE
} from "../../../../sharedUtilities/constants";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import Dropdown from "../../../common/components/Dropdown";
import { intakeSourceIsRequired } from "../../../formFieldLevelValidations";
import CreateCaseActions from "./CreateCaseActions";
import getIntakeSourceDropdownValues from "../../intakeSources/thunks/getIntakeSourceDropdownValues";
import { formatAddressAsString } from "../../utilities/formatAddress";
import { scrollToFirstErrorWithValue } from "../../../common/helpers/scrollToFirstError";
import AnonymousFields from "./AnonymousFields";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";

const styles = {
  dialogPaper: {
    minWidth: "40%"
  }
};

class CreateCaseDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complaintTypes: []
    };
  }

  componentDidMount() {
    this.props.dispatch(getIntakeSourceDropdownValues());
  }

  componentDidUpdate() {
    if (
      this.props.chooseComplaintTypeFeatureFlag &&
      this.state.complaintTypes.length === 0
    ) {
      axios
        .get("/api/complaint-types")
        .then(response => this.setState({ complaintTypes: response.data }))
        .catch(error =>
          this.props.dispatch(
            snackbarError("There was a problem retrieving complaint types")
          )
        );
    }
  }

  render() {
    const {
      classes,
      complaintType,
      complainantType,
      handleSubmit,
      isUnknown,
      open,
      organization,
      submitting
    } = this.props;
    const civilianComplainant = complainantType === CIVILIAN_INITIATED;

    return (
      <Dialog
        data-testid="createCaseDialog"
        classes={{
          paper: classes.dialogPaper
        }}
        open={open}
        fullWidth
        PaperProps={{
          title: "createCaseDialogTitle"
        }}
      >
        <DialogTitle
          data-testid="createCaseDialogTitle"
          aria-label="createCaseDialogTitle"
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
            <Timeline organization={organization} />
            <IntakeSource intakeSources={this.props.intakeSources} />
            <br />
            {this.props.chooseComplaintTypeFeatureFlag ? (
              <>
                <Field
                  component={Dropdown}
                  placeholder="Select a Complaint Type"
                  name="case.complaintType"
                  style={{ width: "90%", marginBottom: "15px" }}
                  inputProps={{
                    "data-testid": "complaintTypeDropdown",
                    "aria-label": "Complaint Type Dropdown"
                  }}
                >
                  {generateMenuOptions(
                    this.state.complaintTypes.map(type => type.name)
                  )}
                </Field>
                <br />
              </>
            ) : (
              ""
            )}
            <Field
              name="case.complainantType"
              component={ComplaintTypeRadioGroup}
            />
            <br />
            {civilianComplainant && (
              <>
                <AnonymousFields />
                {isUnknown ? (
                  ""
                ) : (
                  <CivilianComplainantFields
                    formattedAddress={this.props.formattedAddress}
                    formName={CREATE_CASE_FORM_NAME}
                  />
                )}
              </>
            )}
          </form>
        </DialogContent>
        <CreateCaseActions
          complainantType={complainantType}
          handleSubmit={handleSubmit}
          disabled={submitting}
          change={this.props.change}
        />
      </Dialog>
    );
  }
}

const Timeline = props => (
  <>
    <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
      Timeline
    </Typography>
    <DateField
      required
      name="case.firstContactDate"
      label={`First Contacted ${props.organization}`}
      data-testid="firstContactDateField"
      inputProps={{
        "data-testid": "firstContactDateInput",
        type: "date",
        max: moment(Date.now()).format(ISO_DATE),
        autoComplete: "off",
        "aria-label": "First Contact Date Field"
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
      inputProps={{
        "data-testid": "intakeSourceInput",
        autoComplete: "off",
        "aria-label": "Intake Source Field"
      }}
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
  const chooseComplaintTypeFeatureFlag =
    state.featureToggles.chooseComplaintType;
  const complainantType = selector(state, "case.complainantType");
  let complaintTypeValues;
  if (chooseComplaintTypeFeatureFlag) {
    complaintTypeValues = selector(state, "case.complaintType");
  } else {
    complaintTypeValues = complainantType;
  }
  const isUnknown = selector(state, "civilian.isUnknown");

  return {
    addressValid: state.ui.addressInput.addressValid,
    chooseComplaintTypeFeatureFlag,
    complaintType: complaintTypeValues,
    complainantType: complainantType,
    formattedAddress: formatAddressAsString(addressValues.address),
    intakeSources: state.ui.intakeSources,
    isUnknown,
    open: state.ui.createDialog.case.open,
    organization: state.configs[CONFIGS.ORGANIZATION]
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
      complainantType: CIVILIAN_INITIATED,
      firstContactDate: moment(Date.now()).format(ISO_DATE)
    }
  }
})(ConnectedDialog);
