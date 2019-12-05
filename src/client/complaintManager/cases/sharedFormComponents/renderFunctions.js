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

export const renderField = props => {
  const {
    required,
    name,
    input,
    label,
    style,
    type,
    inputProps,
    placeholder,
    fullWidth,
    multiline,
    rowsMax,
    InputProps,
    meta: { touched, error, warning }
  } = props;
  return (
    <TextField
      {...props}
      required={required}
      label={label}
      name={name}
      error={touched && !!error}
      helperText={touched && error ? touched && error : null}
      {...input}
      inputProps={inputProps}
      InputProps={InputProps}
      data-test={props["data-test"]}
      style={style}
      type={type}
      placeholder={placeholder}
      fullWidth={fullWidth}
      multiline={multiline}
      rowsMax={rowsMax ? rowsMax : 1}
    />
  );
};

export const renderDateField = props => {
  const {
    required,
    input,
    label,
    inputProps,
    style,
    InputLabelProps,
    meta: { touched, error, warning }
  } = props;
  return (
    <TextField
      required={required}
      label={label}
      type={inputProps.type}
      error={touched && !!error}
      helperText={touched && error ? touched && error : null}
      {...input}
      inputProps={inputProps}
      style={style}
      data-test={props["data-test"]}
      InputLabelProps={InputLabelProps}
    />
  );
};
