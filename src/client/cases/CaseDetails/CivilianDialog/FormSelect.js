import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import FormControl from "@material-ui/core/FormControl";

const styles = theme => ({
  root: {},
  input: {
    display: "flex",
    padding: 0
  },
  valueContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    paddingBottom: 5
  },
  singleValue: {
    fontSize: 16,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  paper: {
    position: "relative",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    // top controls the space between the paper and input box
    // menuPlacement on react select does not play nice with material UI so css tricks were used to get it to behave
    top: 20,
    left: 0,
    right: 0,
    overflow: "auto"
  }
});

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  let inputPropsExists = "inputProps" in props.selectProps;
  let dataTestExists =
    inputPropsExists && "data-test" in props.selectProps.inputProps
      ? true
      : null;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
          role: "button",
          "data-test":
            dataTestExists && props.selectProps.inputProps["data-test"]
        }
      }}
      value={props.selectProps.textFieldProps.value}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="li"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      role="option"
      data-value={props.data.value}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.data.value === "" ? "" : props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function Menu(props) {
  return (
    <Paper
      role="listbox"
      id={props.selectProps.name}
      data-test="menu-paper"
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  Option,
  SingleValue,
  ValueContainer,
  DropdownIndicator: ArrowDropDownIcon
};

export const getSelectedValue = (props, options) => {
  let indexOfSelectedValue = -1;

  if (options && Array.isArray(options)) {
    indexOfSelectedValue = options
      .map(option => {
        return option.value;
      })
      .indexOf(props.input.value);
  }
  let selectedValue = {
    label: "",
    value: ""
  };

  if (indexOfSelectedValue >= 0) {
    selectedValue = options[indexOfSelectedValue];
  }

  return selectedValue;
};

const isDisabled = custom => {
  if ("disabled" in custom) return custom.disabled;
};

export const getOptionsIfEnabled = (custom, children) => {
  if (isDisabled(custom)) {
    return [];
  } else {
    return children;
  }
};

class NoBlurTextField extends React.Component {
  handleChange = event => {
    this.props.input.onChange(event && event.value);
  };

  handleBlur = event => {
    this.props.input.onBlur(event && event.value);
  };

  render() {
    const { classes, theme, input, children, ...custom } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit"
        }
      })
    };

    const selectedValue = getSelectedValue(
      this.props,
      getOptionsIfEnabled(custom, children)
    );

    const hasError =
      custom.required && custom.meta.touched && custom.meta.invalid;

    return (
      <FormControl style={custom.style} data-test={custom["data-test"]}>
        <Select
          {...custom}
          name={input.name}
          classes={classes}
          styles={selectStyles}
          options={getOptionsIfEnabled(custom, children)}
          textFieldProps={{
            label: custom.label,
            InputLabelProps: {
              required: custom.required
            },
            value: selectedValue.value,
            inputProps: { ...custom },
            helperText: hasError && custom.meta.error,
            error: hasError
          }}
          components={components}
          value={selectedValue}
          openMenuOnFocus={true}
          isClearable
          placeholder={""}
          onBlur={() => this.handleBlur.bind(this)}
          onChange={this.handleChange.bind(this)}
          onMenuOpen={this.onMenuOpen}
          menuPlacement="top"
          menuPosition="fixed"
          maxMenuHeight="260"
        />
      </FormControl>
    );
  }
}

NoBlurTextField.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(NoBlurTextField);
