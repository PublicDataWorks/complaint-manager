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

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const isOfficer = type => type.employeeDescription === "Officer";

const ComplainantTypeRadioGroup = props => {
  let officerAdded = false;
  return (
    <FormControl>
      {props.showLabels ? (
        <>
          <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
            Complainant Information
          </Typography>
          <FormLabel>The complainant is a...</FormLabel>
        </>
      ) : (
        ""
      )}
      <RadioGroup
        style={{ flexDirection: "row" }}
        {...props}
        value={props.input.value}
      >
        {Object.keys(PERSON_TYPE).reduce((acc, key) => {
          let type = PERSON_TYPE[key];
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
              key={key}
              label={isOfficer(type) ? "Police Officer" : type.description}
              value={key}
              control={<Radio color="primary" />}
              onClick={() => props.input.onChange(key)}
            />
          );
          return acc;
        }, [])}
      </RadioGroup>
    </FormControl>
  );
};

export default connect(state => ({
  pd: state.configs[CONFIGS.PD]
}))(ComplainantTypeRadioGroup);
