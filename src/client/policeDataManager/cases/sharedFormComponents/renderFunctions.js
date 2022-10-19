import React from "react";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import { RadioGroup } from "@material-ui/core";

export const renderRadioGroup = props => {
  return <RadioGroup {...props} {...props.input} />;
};

export const renderCheckbox = props => {
  return (
    <Checkbox
      {...props}
      {...props.input}
      checked={props.input.value ? true : false}
    />
  );
};

export const renderTextField = props => {
  const {
    input,
    maxRows,
    meta: { touched, error, warning }
  } = props;
  return (
    <TextField
      {...props}
      error={touched && !!error}
      helperText={touched && error ? touched && error : null}
      {...input}
      maxRows={maxRows ? maxRows : 1}
    />
  );
};

export const renderDateField = props => {
  const {
    input,
    inputProps,
    meta: { touched, error, warning }
  } = props;
  return (
    <TextField
      {...props}
      type={inputProps.type}
      error={touched && !!error}
      helperText={touched && error ? touched && error : null}
      {...input}
    />
  );
};
