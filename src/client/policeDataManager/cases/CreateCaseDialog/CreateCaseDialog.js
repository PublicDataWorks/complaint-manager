import React, { useState, useEffect } from "react";
import { Field, formValueSelector, initialize, reduxForm } from "redux-form";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  withStyles
} from "@material-ui/core";
import moment from "moment";
import DateField from "../sharedFormComponents/DateField";
import CivilianComplainantFields from "./CivilianComplainantFields";
import {
  CONFIGS,
  CREATE_CASE_FORM_NAME,
  ISO_DATE,
  SHOW_FORM
} from "../../../../sharedUtilities/constants";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import Dropdown from "../../../common/components/Dropdown";
import {
  intakeSourceIsRequired,
  complaintTypeIsRequired,
  priorityLevelIsRequired,
  priorityReasonIsRequired
} from "../../../formFieldLevelValidations";
import CreateCaseActions from "./CreateCaseActions";
import getIntakeSourceDropdownValues from "../../intakeSources/thunks/getIntakeSourceDropdownValues";
import getPriorityLevelDropdownValues from "../../intakeSources/thunks/priorityLevelsThunks/getPriorityLevelDropdownValues";
import getPriorityReasonsDropdownValues from "../../intakeSources/thunks/priorityReasonsThunks/getPriorityReasonsDropdownValues";
import { formatAddressAsString } from "../../utilities/formatAddress";
import { scrollToFirstErrorWithValue } from "../../../common/helpers/scrollToFirstError";
import AnonymousFields from "./AnonymousFields";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";
import PersonTypeSelection from "./PersonTypeSelection";
import {
  getDefaultPersonType,
  getSelectedPersonType
} from "../../globalData/person-type-selectors";
import { fetchPriorityReasons } from "./priorityReasonsSlice";

const styles = {
  dialogPaper: {
    minWidth: "40%"
  }
};

const CreateCaseDialog = ({
  classes,
  complainantType,
  handleSubmit,
  isUnknown,
  open,
  organization,
  submitting,
  chooseComplaintTypeFeatureFlag,
  priorityLevels,
  priorityReasons,
  intakeSources,
  defaultPersonType,
  formattedAddress,
  selectedPersonType,
  personTypes,
  change
}) => {
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [dropdownValue, setDropdownValue] = useState({
    label: "",
    value: null
  });

  const handleDropdownChange = newValue => setDropdownValue(newValue);
  const dispatch = useDispatch();
  const error = useSelector(state => state.ui.priorityReasons.error);

  useEffect(() => {
    dispatch(fetchPriorityReasons());
    dispatch(getIntakeSourceDropdownValues());
    dispatch(getPriorityLevelDropdownValues());
    dispatch(getPriorityReasonsDropdownValues());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(snackbarError(error));
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (chooseComplaintTypeFeatureFlag && complaintTypes.length === 0) {
      axios
        .get("/api/complaint-types")
        .then(response => setComplaintTypes(response.data))
        .catch(error =>
          dispatch(
            snackbarError("There was a problem retrieving complaint types")
          )
        );
    }

    // if (priorityReasons.length === 0) {
    //   ();
    // }

    if (!selectedPersonType && defaultPersonType) {
      dispatch(
        initialize(CREATE_CASE_FORM_NAME, {
          case: {
            complainantType: defaultPersonType.key,
            firstContactDate: moment(Date.now()).format(ISO_DATE)
          }
        })
      );
    }
  }, [
    chooseComplaintTypeFeatureFlag,
    complaintTypes,
    priorityReasons,
    selectedPersonType,
    defaultPersonType,
    dispatch
  ]);

  const resetForm = () => {
    setComplaintTypes([]);
    setPriorityReasons([]);
    setDropdownValue({
      label: "",
      value: null
    });
  };

  return (
    <Dialog
      data-testid="createCaseDialog"
      classes={{
        paper: classes.dialogPaper
      }}
      open={open}
      fullWidth
      style={{ position: "absolute", top: "70px" }}
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
            Enter as much information as available to start a case. You will be
            able to edit this information later.
          </Typography>
        </DialogContentText>
        <form data-testid="createCaseForm">
          <Timeline organization={organization} />
          <IntakeSource
            handleDropdownChange={handleDropdownChange}
            intakeSources={intakeSources}
          />
          <br />

          {dropdownValue === "Priority Incident" && (
            <div>
              <PriorityLevel priorityLevels={priorityLevels} />
              <br />
              <PriorityReason priorityReasons={priorityReasons} />
              <br />
            </div>
          )}

          {chooseComplaintTypeFeatureFlag && (
            <>
              <Field
                required
                component={Dropdown}
                placeholder="Select a Complaint Type*"
                name="case.complaintType"
                style={{ width: "90%", marginBottom: "15px" }}
                inputProps={{
                  "data-testid": "complaintTypeDropdown",
                  "aria-label": "Complaint Type Dropdown"
                }}
                validate={[complaintTypeIsRequired]}
              >
                {generateMenuOptions(
                  complaintTypes.map(type => type.name).sort()
                )}
              </Field>
              <br />
            </>
          )}
          <PersonTypeSelection
            personTypes={personTypes}
            selectedType={selectedPersonType}
            showLabels={true}
            subtypeFieldName="civilian.personSubType"
            typeFieldName="case.complainantType"
          />
          {selectedPersonType?.dialogAction === SHOW_FORM && (
            <>
              <AnonymousFields />
              {!isUnknown && (
                <CivilianComplainantFields
                  formattedAddress={formattedAddress}
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
        change={change}
        resetForm={resetForm}
      />
    </Dialog>
  );
};

const Timeline = ({ organization }) => (
  <>
    <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
      Timeline
    </Typography>
    <DateField
      required
      name="case.firstContactDate"
      label={`First Contacted ${organization}`}
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

const IntakeSource = ({ intakeSources, handleDropdownChange }) => (
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
    handleDropdownChange={handleDropdownChange}
  >
    {generateMenuOptions(intakeSources)}
  </Field>
);

const PriorityLevel = ({ priorityLevels }) => (
  <Field
    required
    component={Dropdown}
    label="Priority Level"
    data-testid="priorityLevelDropdown"
    placeholder="Select a Priority Level"
    name="case.priorityLevels"
    style={{ width: "90%", marginBottom: "15px" }}
    inputProps={{
      "data-testid": "priorityLevelInput",
      "aria-label": "Priority Level Input"
    }}
    validate={[priorityLevelIsRequired]}
  >
    {generateMenuOptions(priorityLevels)}
  </Field>
);

const PriorityReason = ({ priorityReasons }) => (
  <Field
    required
    name="case.priorityReasons"
    component={Dropdown}
    label="Priority Reason"
    placeholder="Select a Priority Reason"
    style={{ width: "90%", marginBottom: "15px" }}
    inputProps={{
      "data-testid": "priorityReasonDropdown",
      "aria-label": "Priority Reason Dropdown"
    }}
    validate={[priorityReasonIsRequired]}
  >
    {generateMenuOptions(priorityReasons)}
  </Field>
);

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
  const isUnknown = selector(state, "civilian.isUnknown");

  return {
    addressValid: state.ui.addressInput.addressValid,
    chooseComplaintTypeFeatureFlag,
    complainantType,
    defaultPersonType: getDefaultPersonType(state),
    formattedAddress: formatAddressAsString(addressValues.address),
    intakeSources: state.ui.intakeSources,
    priorityLevels: state.ui.priorityLevels,
    priorityReasons: state.ui.priorityReasons,
    isUnknown,
    open: state.ui.createDialog.case.open,
    organization: state.configs[CONFIGS.ORGANIZATION],
    personTypes: state.personTypes,
    selectedPersonType: getSelectedPersonType(state, complainantType)
  };
};

const ConnectedDialog = connect(mapStateToProps)(
  withStyles(styles)(CreateCaseDialog)
);

export default reduxForm({
  form: CREATE_CASE_FORM_NAME,
  onSubmitFail: scrollToFirstErrorWithValue
})(ConnectedDialog);
