import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  Typography
} from "@material-ui/core";
import { RadioGroup } from "redux-form-material-ui";
import {
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../../sharedUtilities/constants";
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
        value={CIVILIAN_INITIATED}
        control={<Radio color="primary" />}
        label="Civilian"
        onClick={props.setCivilianComplainantType}
      />
      <FormControlLabel
        data-test="officerRadioButton"
        value={RANK_INITIATED}
        control={<Radio color="primary" />}
        label="Police Officer"
        onClick={props.setOfficerComplainantType}
      />
    </RadioGroup>
  </FormControl>
);

export default ComplainantTypeRadioGroup;
