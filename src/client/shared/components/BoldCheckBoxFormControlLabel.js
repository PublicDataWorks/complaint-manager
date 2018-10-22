import { withStyles } from "@material-ui/core/styles";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Field } from "redux-form";
import PurpleCheckBox from "./PurpleCheckBox";

const styles = {
  label: { fontWeight: "bold" }
};

const BoldCheckBoxFormControlLabel = ({ classes, name, labelText }) => (
  <FormControlLabel
    classes={classes}
    control={<Field name={name} component={PurpleCheckBox} />}
    label={labelText}
  />
);

export default withStyles(styles)(BoldCheckBoxFormControlLabel);
