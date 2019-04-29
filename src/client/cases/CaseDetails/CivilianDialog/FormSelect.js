import React from "react";
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import FormControl from '@material-ui/core/FormControl'

const styles = theme => ({
  root: {
    flexGrow: 1,
    flexWrap: 'wrap'
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    // flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  paper: {
    position: 'relative',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
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
            },
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
          component="div"
          style={{
            fontWeight: props.isSelected ? 500 : 400,
          }}
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
      <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
        {props.children}
      </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
  return (
      <Paper className={props.selectProps.classes.paper} {...props.innerProps}>
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
  DropdownIndicator: ArrowDropDownIcon,
};

class NoBlurTextField extends React.Component {

  state = {
    selected: '',
    options: [],
  };

  constructor(props) {
    super(props);
  }

  onChange(event) {
    if (this.props.input.onChange && event != null) {
      this.props.input.onChange(event.value);
      this.setState({
        selected: event.label
      })
    } else {
      this.props.input.onChange(null);
    }
  }

  componentWillMount() {
    this.createOptions(this.props.children);
    this.setLabelToInputValue(this.props.input.value, this.state.options)
  }

  createOptions(children) {
    let options = [];
    for(let child of children) {
      options.push({
        label: child.props.children,
        value: child.props.value
      });
    }
    console.log(options);
    this.setState({
      options: options,
    })
  };

  setLabelToInputValue(value, options) {
    console.log('initial check');
    if (value === "") {
      console.log('found empty value');
      this.setState({
        selected: ''
      });
      console.log('before this return stuff');
      return;
    }
    console.log('after initial');
    for (let option of options) {
      console.log('found non empty value');
      if (option.value === value) {
        this.setState({
          selected: option.label
      });
        return;
      }
    }
    console.log('found nothing :(');
    return;
  }

  render() {
    const {classes, theme, input, children, ...custom} = this.props;
    //
    // const options = this.createOptions(children);
    //
    // this.setLabelToInputValue(input.value, options);

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    const hasError = (custom.required && custom.meta.touched && custom.meta.invalid);

    console.log(custom);
    console.log(input);
    console.log(this.props);

    return(
      <FormControl className={classes.root} style={custom.style}>
        <Select
          {...input}
          {...custom}
          options={this.state.options}
          textFieldProps={{
            label: custom.label,
            InputLabelProps: {
              required: custom.required,
            },
            helperText: (hasError && custom.meta.error),
            value: this.state.selected,
            error: hasError,
          }}
          value={this.state.selected}
          onChange={this.onChange.bind(this)}
          onBlur={() => input.onBlur(input.value)}
          classes={classes}
          menuPlacement="auto"
          menuPosition='fixed'
          styles={selectStyles}
          components={components}
          placeholder=""
          id={input.name}
          name={input.name}
        />
      </FormControl>
    );
  }
}

NoBlurTextField.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(NoBlurTextField);