import React from "react";
import { Field } from "redux-form";
import { TextField } from "redux-form-material-ui";

const AdditionalLocationInfo = ({ label, fieldName, style }) => {
  return (
    <Field
      label={label}
      name={`${fieldName}.additionalLocationInfo`}
      component={TextField}
      style={style}
      inputProps={{
        "data-test": "additionalLocationInfoInput",
        maxLength: 255
      }}
      multiline
      InputLabelProps={{ shrink: true }}
      data-test="additionalLocationInfo"
      placeholder={"Ex: In front of building"}
    />
  );
};

export default AdditionalLocationInfo;
