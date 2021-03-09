import React from "react";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

export const getSelectedOption = (inputValue, options) => {
  let selectedOption = {
    label: "",
    value: ""
  };

  let indexOfSelectedValue = -1;
  if (options && Array.isArray(options)) {
    indexOfSelectedValue = options
      .map(option => {
        return option.value;
      })
      .indexOf(inputValue);
  }
  if (indexOfSelectedValue >= 0) {
    selectedOption = options[indexOfSelectedValue];
  }

  return selectedOption;
};

class Dropdown extends React.Component {
  handleChange = (event, value) => {
    this.props.input.onChange(event && value.value);
  };

  render() {
    const { children, ...parentProps } = this.props;
    const inputValue = this.props.input.value;
    const selectedOption = getSelectedOption(inputValue, children);
    const hasError =
      parentProps.required &&
      parentProps.meta.touched &&
      parentProps.meta.invalid;
    return (
      <FormControl style={parentProps.style}>
        <Autocomplete
          autoSelect={true}
          disableClearable={true}
          disabled={this.props.inputProps.disabled}
          onChange={this.handleChange.bind(this)}
          value={selectedOption}
          options={children && Array.isArray(children) ? children : []}
          getOptionLabel={option => {
            return option.label;
          }}
          renderInput={params => {
            params.inputProps = {
              ...params.inputProps,
              ...parentProps.inputProps,
              autoComplete: "disabled"
            };
            return (
              <TextField
                fullWidth
                {...params}
                name={parentProps.input.name}
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

export default Dropdown;
