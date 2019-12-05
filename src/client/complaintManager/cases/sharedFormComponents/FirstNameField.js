import React from "react";
import { Field } from "redux-form";
import {
  firstNameNotBlank,
  firstNameRequired
} from "../../../formFieldLevelValidations";
import { renderField } from "./renderFunctions";

const FirstNameField = props => (
  <Field
    required
    classes={props.classes}
    name={props.name}
    label="First Name"
    component={renderField}
    inputProps={{
      maxLength: 25,
      autoComplete: "disabled",
      "data-test": "firstNameInput"
    }}
    data-test="firstNameField"
    validate={[firstNameRequired, firstNameNotBlank]}
    style={{ width: "140px", marginRight: "5%", marginBottom: "3%" }}
  />
);

export default FirstNameField;
