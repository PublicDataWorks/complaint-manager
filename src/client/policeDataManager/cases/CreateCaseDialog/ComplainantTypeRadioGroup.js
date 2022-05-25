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
import {
  CIVILIAN_INITIATED,
  CONFIGS,
  RANK_INITIATED
} from "../../../../sharedUtilities/constants";

const ComplainantTypeRadioGroup = props => (
  <FormControl>
    <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
      Complainant Information
    </Typography>
    <FormLabel>The complainant is a...</FormLabel>
    <RadioGroup
      style={{ flexDirection: "row" }}
      {...props}
      value={props.input.value}
    >
      <FormControlLabel
        style={{ marginRight: "48px" }}
        data-testid="civilianRadioButton"
        value={CIVILIAN_INITIATED}
        control={<Radio color="primary" />}
        label="Civilian"
        onClick={() => props.input.onChange(CIVILIAN_INITIATED)}
      />
      <FormControlLabel
        data-testid="officerRadioButton"
        value={RANK_INITIATED}
        control={<Radio color="primary" />}
        label="Police Officer"
        onClick={() => props.input.onChange(RANK_INITIATED)}
      />
      <FormControlLabel
        data-testid="civilianWithinPDRadioButton"
        value={`Civilian Within ${props.pd} Initiated`}
        control={<Radio color="primary" />}
        label={`Civilian (${props.pd})`}
        onClick={() =>
          props.input.onChange(`Civilian Within ${props.pd} Initiated`)
        }
      />
    </RadioGroup>
  </FormControl>
);

export default connect(state => ({
  pd: state.configs[CONFIGS.PD]
}))(ComplainantTypeRadioGroup);
