import React from "react";
import { Field } from "redux-form";
import {
  firstNameNotBlank,
  firstNameRequired
} from "../../../formFieldLevelValidations";
import { renderTextField } from "./renderFunctions";

const FirstNameField = props => (
  <Field
    required
    classes={props.classes}
    name={props.name}
    label="First Name"
    component={renderTextField}
    inputProps={{
      maxLength: 25,
      autoComplete: "disabled",
      "data-testid": "firstNameInput",
      "aria-label": "First Name Field"
    }}
    data-testid="firstNameField"
    validate={[firstNameRequired, firstNameNotBlank]}
    style={{ width: "140px", marginRight: "5%", marginBottom: "3%" }}
  />
);

export default FirstNameField;
