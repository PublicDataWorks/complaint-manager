import React from "react";
import Select from "react-select";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import FormControl from "@material-ui/core/FormControl";

const styles = theme => ({
  root: {
    flexGrow: 1,
    flexWrap: "wrap"
  },
  input: {
    display: "flex",
    padding: 0
  },
  valueContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
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
  },
  divider: {
    // height: theme.spacing.unit * 2,
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

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
          custom: props.custom,
          role: "button",
          "data-test":
            dataTestExists && props.selectProps.inputProps["data-test"]
        }
      }}
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

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
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
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  DropdownIndicator: ArrowDropDownIcon
};

class NoBlurTextField extends React.Component {
  state = {
    selected: { label: "", value: "" },
    options: []
  };

  constructor(props) {
    super(props);
  }

  onChange(event) {
    if (this.props.input.onChange && event != null) {
      this.props.input.onChange(event.value);
      if (event.value === "") {
        this.setState({
          selected: { label: "", value: "" }
        });
      } else {
        this.setState({
          selected: { label: event.label, value: event.value }
        });
      }
    } else {
      this.props.input.onChange(null);
    }
  }

  componentWillMount() {
    this.setLabelToInputValue(this.createOptions(this.props.children));
  }

  createOptions(children) {
    let tempOptions = [];
    for (let child of Array.from(children)) {
      tempOptions.push({
        label: child.props.children,
        value: child.props.value
      });
    }
    return tempOptions;
  }

  setLabelToInputValue(options) {
    let value = this.props.input.value;
    if (value === "") {
      this.setState({
        selected: { label: "", value: "" }
      });
      return;
    }
    for (let option of options) {
      if (option.value === value) {
        this.setState({
          selected: option
        });
        return;
      }
    }
  }

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

    const hasError =
      custom.required && custom.meta.touched && custom.meta.invalid;

    return (
      <FormControl style={custom.style} data-test={custom["data-test"]}>
        <Select
          {...input}
          {...custom}
          options={this.createOptions(children)}
          textFieldProps={{
            label: custom.label,
            InputLabelProps: {
              required: custom.required
            },
            inputProps: { ...custom },
            value: this.state.selected.value,
            helperText: hasError && custom.meta.error,
            error: hasError
          }}
          value={this.state.selected}
          onChange={this.onChange.bind(this)}
          onBlur={() => input.onBlur(input.value)}
          classes={classes}
          menuPlacement="top"
          menuPosition="fixed"
          styles={selectStyles}
          components={components}
          placeholder=""
          name={input.name}
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
