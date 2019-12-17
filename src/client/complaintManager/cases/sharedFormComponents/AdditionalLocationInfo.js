import React from "react";
import { Field } from "redux-form";
import { renderTextField } from "./renderFunctions";

const AdditionalLocationInfo = ({ label, fieldName, style }) => {
  return (
    <Field
      label={label}
      name={`${fieldName}.additionalLocationInfo`}
      component={renderTextField}
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
