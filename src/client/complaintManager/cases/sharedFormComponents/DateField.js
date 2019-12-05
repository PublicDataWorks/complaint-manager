import React from "react";
import { Field } from "redux-form";
import { notFutureDate } from "../../../formFieldLevelValidations";
import moment from "moment";
import { renderDateField } from "./renderFunctions";

const DateField = ({ inputProps, style, clearable = false, ...fieldProps }) => {
  return (
    <Field
      {...fieldProps}
      component={renderDateField}
      inputProps={{
        ...inputProps,
        style: {
          paddingBottom: "2px"
        }
      }}
      style={style}
      InputLabelProps={{
        shrink: true
      }}
      validate={[notFutureDate]}
      normalize={(date, prevDate) => {
        const isValid = moment(new Date(date)).isValid();
        if (!clearable) {
          return isValid ? date : prevDate;
        } else {
          return isValid ? date : "";
        }
      }}
    />
  );
};

export default DateField;
