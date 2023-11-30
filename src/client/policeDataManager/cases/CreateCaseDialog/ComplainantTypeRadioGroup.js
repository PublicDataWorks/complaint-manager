import React from "react";
import { connect } from "react-redux";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core";
import { CONFIGS } from "../../../../sharedUtilities/constants";

const isOfficer = type => type.employeeDescription === "Officer";

const ComplainantTypeRadioGroup = props => {
  let officerAdded = false;
  return (
    <FormControl>
      {props.showLabels && (
        <>
          <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
            Complainant Information
          </Typography>
          <FormLabel>The complainant is a...</FormLabel>
        </>
      )}
      <RadioGroup
        style={{ flexDirection: "row" }}
        {...props}
        value={props.input.value}
      >
        {props.personTypes.reduce((acc, type) => {
          if (isOfficer(type)) {
            if (officerAdded) {
              return acc;
            } else {
              officerAdded = true;
            }
          }
          acc.push(
            <FormControlLabel
              style={{ marginRight: "48px" }}
              data-testid={`${(type.isEmployee
                ? type.employeeDescription
                : type.description
              )
                .toLowerCase()
                .replaceAll(" ", "-")}-radio-button`}
              key={type.key}
              label={isOfficer(type) ? "Police Officer" : type.description}
              value={type.key}
              control={<Radio color="primary" />}
              onClick={() => props.input.onChange(type.key)}
            />
          );
          return acc;
        }, [])}
      </RadioGroup>
      {props.meta.touched && props.meta.invalid && (
        <p class="MuiFormHelperText-root Mui-error Mui-required">
          {props.meta.error}
        </p>
      )}
    </FormControl>
  );
};

export default connect(state => ({
  pd: state.configs[CONFIGS.PD],
  personTypes: state.personTypes
}))(ComplainantTypeRadioGroup);
