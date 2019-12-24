import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

export const getSelectedValue = (selectedInput, options, freeSolo) => {
  let indexOfSelectedValue = -1;

  if (options && Array.isArray(options)) {
    indexOfSelectedValue = options
      .map(option => {
        console.log("Selected options", option.value);
        return option.value;
      })
      .indexOf(selectedInput.value);
  }

  let selectedValue = freeSolo
    ? { label: selectedInput.value, value: selectedInput.value }
    : {
        label: "",
        value: ""
      };

  if (indexOfSelectedValue >= 0) {
    selectedValue = options[indexOfSelectedValue];
  }
  return selectedValue;
};

class Dropdown extends React.Component {
  handleChange = (event, value) => {
    if (this.props.freeSolo) {
      console.log("Props is, ", value);
      this.props.input.onChange(event && value);
    } else {
      this.props.input.onChange(event && value.value);
    }
  };

  render() {
    const { freeSolo, disableClearable, children, ...custom } = this.props;
    const selectedValue = getSelectedValue(this.props.input, children);
    console.log("Selected value at this point", selectedValue);

    return (
      <Autocomplete
        freeSolo={freeSolo}
        disableClearable={disableClearable}
        onChange={this.handleChange.bind(this)}
        value={selectedValue}
        options={children}
        getOptionLabel={option => {
          return option.label;
        }}
        renderInput={params => {
          return <TextField value {...params} {...custom} />;
        }}
      />
    );
  }
}

export default Dropdown;
