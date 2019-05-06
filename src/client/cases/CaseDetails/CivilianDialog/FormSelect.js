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
    left: 0,
    right: 0
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
  console.log("----inputComponent----");
  // console.log(inputRef);
  // console.log(props);
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  console.log("----Control----");
  console.log(props);
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
          custom: props.custom
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  console.log("----Option----");
  console.log(props);
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
  console.log("----valueContainer----");
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function Menu(props) {
  console.log("MENUUUUU:)");
  console.log(props);
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
    // console.log('------------------------------------------------------')
  }

  onChange(event) {
    if (this.props.input.onChange && event != null) {
      this.props.input.onChange(event.value);
      if (event.value === "") {
        // console.log("yoooo");
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
    // this.createOptions(this.props.children);
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
    // console.log(tempOptions);
    // this.setState({
    //     options: tempOptions
    //   },
    //   this.setLabelToInputValue(tempOptions)
    // )
  }

  setLabelToInputValue(options) {
    let value = this.props.input.value;
    // console.log('value is ' + value);
    if (value === "") {
      this.setState({
        selected: { label: "", value: "" }
      });
      return;
    }
    // console.log(options);
    for (let option of options) {
      if (option.value === value) {
        this.setState({
          selected: option
        });
        return;
      }
    }
    // console.log('found nothing :(');
  }

  render() {
    const { classes, theme, input, children, ...custom } = this.props;
    //
    // const options = this.createOptions(children);
    //
    // this.setLabelToInputValue(input.value, options);

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

    console.log(custom);
    console.log(custom["data-test"]);
    // console.log(input);
    console.log(this.props);
    // console.log(this.state.selected);
    // console.log('this.selected: ' + this.selected);

    return (
      <FormControl style={custom.style} data-test={custom["data-test"]}>
        <Select
          {...input}
          {...custom}
          // children={children}
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
          menuPlacement="auto"
          menuPosition="fixed"
          // menuIsOpen={true}
          styles={selectStyles}
          components={components}
          placeholder=""
          role="button"
          name={input.name}
          // data-test={(custom.inputProps && custom.inputProps["data-test"])}
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
