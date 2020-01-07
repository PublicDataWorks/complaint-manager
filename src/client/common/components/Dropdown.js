import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import _ from "lodash";

export const getSelectedValue = (inputValue, options, freeSolo) => {
  let indexOfSelectedValue = -1;
  // let inputValue = selectedInput.value.value
  //   ? selectedInput.value.value
  //   : selectedInput.value;

  if (options && Array.isArray(options)) {
    indexOfSelectedValue = options
      .map(option => {
        return option.value;
      })
      .indexOf(inputValue);
  }

  let selectedValue = freeSolo
    ? { label: inputValue, value: inputValue }
    : {
        label: "",
        value: ""
      };

  console.log("Input value", inputValue);

  if (indexOfSelectedValue >= 0) {
    selectedValue = options[indexOfSelectedValue];
  }

  console.log("Selected value ", selectedValue);
  return selectedValue;
};

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    console.log("Props", props);
    const selectedValue = getSelectedValue(
      props.input.value,
      props.children,
      props.freeSolo
    );
    this.state = {
      selectedValue
    };
  }
  handleChange = (event, value) => {
    if (this.props.freeSolo) {
      this.props.input.onChange(event && value);
    } else {
      this.props.input.onChange(event && value.value);
    }
  };

  handleBlur = (event, value) => {
    const newSelectedValue = getSelectedValue(
      this.props.input.value,
      this.props.children,
      this.props.freeSolo
    );

    this.setState({ selectedValue: newSelectedValue });
    if (this.props.freeSolo) {
      this.props.input.onBlur(event && value);
    }
  };

  render() {
    const { freeSolo, disableClearable, children, ...custom } = this.props;
    const inputValue = custom.input.value.value
      ? custom.input.value.value
      : custom.input.value;
    const selectedValue = getSelectedValue(inputValue, children, freeSolo);
    return (
      <Autocomplete
        autoHighlight
        freeSolo={freeSolo}
        includeInputInList
        disableClearable={disableClearable}
        onChange={this.handleChange.bind(this)}
        onBlur={this.handleBlur.bind(this)}
        value={this.state.selectedValue}
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
          const isNotNewlyCreated =
            !freeSolo || _.isInteger(selectedValue.value);
          // console.log("Custom input and isNewTag?", custom.input, isNotNewlyCreated);
          return isNotNewlyCreated ? (
            <TextField {...params} {...custom} />
          ) : (
            <TextField {...params} {...custom.input} {...custom} />
          );
        }}
      />
    );
  }
}

export default Dropdown;
