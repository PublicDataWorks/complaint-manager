import React from "react";
import { Field } from "redux-form";
import { TextField } from "redux-form-material-ui";
import { isEmail } from "../../formFieldLevelValidations";

const EmailField = props => (
  <Field
    name={props.name}
    component={TextField}
    label="Email"
    inputProps={{ "data-test": "emailInput" }}
    data-test="emailField"
    validate={[isEmail]}
    style={{ marginRight: "5%", marginBottom: "3%" }}
    props={{ autoComplete: props.autoComplete }}
  />
);

export default EmailField;
