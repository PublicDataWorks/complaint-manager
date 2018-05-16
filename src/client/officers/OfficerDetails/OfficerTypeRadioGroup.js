import React from "react";
import { FormControl, FormControlLabel, Radio, withStyles } from "material-ui";
import { RadioGroup } from "redux-form-material-ui";

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
          label="Accused"
          value="Accused"
        />
        <FormControlLabel
          className={classes.radio}
          control={<Radio color="primary" />}
          label="Complainant"
          value="Complainant"
        />
        <FormControlLabel
          className={classes.radio}
          control={<Radio color="primary" />}
          label="Witness"
          value="Witness"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default withStyles(styles)(OfficerTypeRadioGroup);
