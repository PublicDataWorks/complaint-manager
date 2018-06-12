import React from "react";
import { FormControl, FormControlLabel, Radio } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { RadioGroup } from "redux-form-material-ui";
import {
  ACCUSED,
  COMPLAINANT,
  WITNESS
} from "../../../sharedUtilities/constants";

const styles = {
  radio: {
    marginRight: "48px"
  }
};

const OfficerTypeRadioGroup = ({ classes, ...other }) => {
  return (
    <FormControl>
      <RadioGroup style={{ flexDirection: "row" }} {...other}>
        <FormControlLabel
          className={classes.radio}
          control={<Radio color="primary" />}
          label={ACCUSED}
          value={ACCUSED}
        />
        <FormControlLabel
          className={classes.radio}
          control={<Radio color="primary" />}
          label={COMPLAINANT}
          value={COMPLAINANT}
        />
        <FormControlLabel
          className={classes.radio}
          control={<Radio color="primary" />}
          label={WITNESS}
          value={WITNESS}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default withStyles(styles)(OfficerTypeRadioGroup);
