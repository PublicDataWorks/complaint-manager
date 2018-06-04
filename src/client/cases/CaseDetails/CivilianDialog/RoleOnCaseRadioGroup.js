import React from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  Typography,
  withStyles
} from "material-ui";
import { RadioGroup } from "redux-form-material-ui";
import { COMPLAINANT, WITNESS } from "../../../../sharedUtilities/constants";

const styles = {
  radio: {
    marginRight: "48px"
  }
};

const RoleOnCaseRadioGroup = ({ classes, ...other }) => (
  <FormControl>
    <Typography variant="body2" style={{ marginBottom: "8px" }}>
      Role On Case
    </Typography>
    <RadioGroup
      {...other}
      style={{ flexDirection: "row", marginBottom: "24px" }}
      data-test="roleOnCaseRadioGroup"
    >
      <FormControlLabel
        className={classes.radio}
        value={COMPLAINANT}
        control={<Radio color="primary" />}
        label={COMPLAINANT}
      />
      <FormControlLabel
        className={classes.radio}
        value={WITNESS}
        control={<Radio color="primary" />}
        label={WITNESS}
      />
    </RadioGroup>
  </FormControl>
);

export default withStyles(styles)(RoleOnCaseRadioGroup);
