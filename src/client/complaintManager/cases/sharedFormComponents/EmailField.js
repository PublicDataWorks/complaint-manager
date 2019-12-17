import React from "react";
import { Field } from "redux-form";
import { isEmail } from "../../../formFieldLevelValidations";
import { renderTextField } from "./renderFunctions";

const EmailField = props => (
  <Field
    name={props.name}
    component={renderTextField}
    label="Email"
    inputProps={{ "data-test": "emailInput" }}
    data-test="emailField"
    validate={[isEmail]}
    style={{ width: "50%" }}
    props={{ autoComplete: props.autoComplete }}
  />
);

export default EmailField;
