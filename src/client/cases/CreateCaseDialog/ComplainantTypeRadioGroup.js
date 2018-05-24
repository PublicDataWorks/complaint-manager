import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  Typography
} from "material-ui";
import { RadioGroup } from "redux-form-material-ui";
import * as _ from "lodash";

const ComplainantTypeRadioGroup = props => (
  <FormControl>
    <Typography variant="body2" style={{ marginBottom: "8px" }}>
      Complainant Information
    </Typography>
    <FormLabel>The complainant is a...</FormLabel>
    <RadioGroup
      style={{ flexDirection: "row" }}
      {..._.omit(props, [
        "setCivilianComplainantType",
        "setOfficerComplainantType"
      ])}
    >
      <FormControlLabel
        style={{ marginRight: "48px" }}
        data-test="civilianRadioButton"
        value="Civilian"
        control={<Radio color="primary" />}
        label="Civilian"
        onClick={props.setCivilianComplainantType}
      />
      <FormControlLabel
        data-test="officerRadioButton"
        value="Police Officer"
        control={<Radio color="primary" />}
        label="Police Officer"
        onClick={props.setOfficerComplainantType}
      />
    </RadioGroup>
  </FormControl>
);

export default ComplainantTypeRadioGroup;
