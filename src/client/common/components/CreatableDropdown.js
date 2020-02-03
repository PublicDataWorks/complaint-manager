import React from "react";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import * as _ from "lodash";

const newTagPrefix = "Create";
export const getSelectedOption = (inputValue, options) => {
  console.log("input value", inputValue);

  let selectedOption = {
    label: inputValue,
    value: inputValue
  };

  let indexOfSelectedValue = -1;
  if (options && Array.isArray(options)) {
    indexOfSelectedValue = options
      .map(option => {
        return option.label;
      })
      .indexOf(inputValue);
  }
  if (indexOfSelectedValue >= 0) {
    selectedOption = options[indexOfSelectedValue];
  }

  console.log("selectedOption End", selectedOption);
  return selectedOption;
};

class CreatableDropdown extends React.Component {
  handleChange = (event, value) => {
    console.log("In handleChange", "value", value);
    if (event) {
      console.log("event type", event.type);
      if (
        event.type &&
        event.type === "click" &&
        value.includes(newTagPrefix)
      ) {
        console.log("Cleaning my input");
        value = value.substring(newTagPrefix.length + 2, value.length - 1);
      }
      const selectedOption = getSelectedOption(value, this.props.children);
      this.props.input.onChange(event && selectedOption);
    }
  };

  isNewOption = selectedOption => {
    console.log("Checking isNewOption", selectedOption);
    return (
      !_.isEmpty(selectedOption.label) &&
      selectedOption.label === selectedOption.value
    );
  };

  render() {
    let { children, ...parentProps } = this.props;
    const inputValue = this.props.input.value;
    let selectedOption = { label: "", value: "" };
    if (inputValue) {
      selectedOption = getSelectedOption(inputValue.label, children);
    }
    if (this.isNewOption(selectedOption)) {
      const newTagString = `${newTagPrefix} "${selectedOption.label}"`;
      children = [{ label: newTagString, value: newTagString }, ...children];
    }
    const hasError =
      parentProps.required &&
      parentProps.meta.touched &&
      parentProps.meta.invalid;
    return (
      <FormControl style={parentProps.style}>
        <Autocomplete
          freeSolo
          forcePopupIcon
          autoSelect={true}
          disableClearable={true}
          // onInputChange and inputValue must be used together: https://github.com/mui-org/material-ui/issues/19423
          onInputChange={this.handleChange.bind(this)}
          inputValue={selectedOption.label}
          options={children && Array.isArray(children) ? children : []}
          getOptionLabel={option => {
            return option.label;
          }}
          renderInput={params => {
            params.inputProps = {
              ...params.inputProps,
              ...parentProps.inputProps
            };
            return (
              <TextField
                fullWidth
                {...params}
                label={parentProps.label}
                InputLabelProps={{ required: parentProps.required }}
                helperText={hasError && parentProps.meta.error}
                error={hasError}
              />
            );
          }}
        />
      </FormControl>
    );
  }
}

export default CreatableDropdown;
