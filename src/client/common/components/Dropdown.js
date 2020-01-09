import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import _ from "lodash";

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
    const { children, ...custom } = this.props;
    const inputValue = this.props.input.value;
    const selectedValue = getSelectedOption(inputValue, children);

    return (
      <Autocomplete
        autoHighlight
        includeInputInList
        disableClearable={true}
        onChange={this.handleChange.bind(this)}
        value={selectedValue}
        options={children}
        autoSelect={true}
        getOptionLabel={option => {
          if (_.isString(option)) {
            return option;
          } else {
            return option.label;
          }
        }}
        renderInput={params => {
          params.inputProps = { ...params.inputProps, ...custom.inputProps };
          return <TextField {...params} />;
        }}
      />
    );
  }
}

export default Dropdown;
