import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Field, change } from "redux-form";
import Dropdown from "../../../common/components/Dropdown";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import getPriorityReasonsDropdownValues from "../../intakeSources/thunks/priorityReasonsThunks/getPriorityReasonsDropdownValues";
import getPriorityLevelDropdownValues from "../../intakeSources/thunks/priorityLevelsThunks/getPriorityLevelDropdownValues";
import {
  priorityLevelIsRequired,
  priorityReasonIsRequired
} from "../../../formFieldLevelValidations";
import {
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography
} from "@material-ui/core";

const PriorityIncident = ({
  change,
  fieldNames,
  formName,
  getPriorityLevelDropdownValues,
  getPriorityReasonsDropdownValues,
  isPriorityIncident: defaultIsPriorityIncident,
  priorityLevels,
  priorityReasons
}) => {
  const [isPriorityIncident, setPriorityIncident] = useState(
    !!defaultIsPriorityIncident
  );
  const [isYesFocused, setYesFocused] = useState(false);
  const [isNoFocused, setNoFocused] = useState(false);

  useEffect(() => {
    getPriorityLevelDropdownValues();
    getPriorityReasonsDropdownValues();
  }, []);

  return (
    <div>
      <Typography
        variant="caption"
        color={isYesFocused || isNoFocused ? "primary" : "default"}
      >
        Priority Incident*
      </Typography>
      <RadioGroup
        name="isPriorityIncident"
        value={isPriorityIncident}
        onChange={(_, value) => {
          setPriorityIncident(value === "Yes");
          if (value === "No") {
            fieldNames.forEach(fieldName => {
              change(
                formName,
                fieldName.endsWith(".id")
                  ? fieldName.substring(0, fieldName.length - 3)
                  : fieldName,
                null
              );
            });
          }
        }}
      >
        <div
          style={{ display: "flex", gap: "2em" }}
          data-testid="priorityIncidentRadioGroup"
        >
          <FormControlLabel
            label="Yes"
            value="Yes"
            onFocus={() => setYesFocused(true)}
            onBlur={() => setYesFocused(false)}
            control={
              <Radio
                color="primary"
                checked={isPriorityIncident}
                inputProps={{
                  "data-testid": "yes-priority-incident-radio"
                }}
              />
            }
          />
          <FormControlLabel
            label="No"
            value="No"
            onFocus={() => setNoFocused(true)}
            onBlur={() => setNoFocused(false)}
            control={
              <Radio
                color="primary"
                checked={!isPriorityIncident}
                inputProps={{
                  "data-testid": "no-priority-incident-radio"
                }}
              />
            }
          />
        </div>
      </RadioGroup>
      {isPriorityIncident && (
        <>
          <Field
            required
            component={Dropdown}
            label="Priority Level"
            data-testid="priorityLevelDropdown"
            placeholder="Select a Priority Level"
            name={fieldNames[0]}
            style={{ width: "90%", marginBottom: "15px" }}
            inputProps={{
              "data-testid": "priorityLevelInput",
              "aria-label": "Priority Level Input"
            }}
            validate={[priorityLevelIsRequired]}
          >
            {generateMenuOptions(priorityLevels)}
          </Field>
          <br />
          <Field
            required
            name={fieldNames[1]}
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
          <br />
        </>
      )}
    </div>
  );
};

export default connect(
  state => ({
    priorityLevels: state.ui.priorityLevels,
    priorityReasons: state.ui.priorityReasons
  }),
  {
    getPriorityReasonsDropdownValues,
    getPriorityLevelDropdownValues,
    change
  }
)(PriorityIncident);
