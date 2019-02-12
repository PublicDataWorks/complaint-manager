import { withStyles } from "@material-ui/core/styles";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Field } from "redux-form";
import PrimaryCheckBox from "./PrimaryCheckBox";

const styles = {
  label: { fontWeight: "bold" }
};

const BoldCheckBoxFormControlLabel = ({
  classes,
  name,
  labelText,
  dataTest
}) => (
  <FormControlLabel
    classes={classes}
    control={
      <Field name={name} component={PrimaryCheckBox} data-test={dataTest} />
    }
    label={labelText}
  />
);

export default withStyles(styles)(BoldCheckBoxFormControlLabel);
