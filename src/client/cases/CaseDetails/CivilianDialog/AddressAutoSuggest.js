import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { MenuItem, Paper, TextField } from "@material-ui/core";
import { change, clearSubmitErrors } from "redux-form";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import poweredByGoogle from "../../../../assets/powered_by_google_on_white_hdpi.png";
import formatAddress from "../../../utilities/formatAddress";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: "relative",
    width: "90%",
    marginBottom: "8px"
  },
  suggestionsContainerOpen: {
    position: "relative",
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  }
});

class AddressAutoSuggest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.defaultText || "",
      selectedAutoSuggest: true,
      suggestionServiceAvailable: true,
      suggestions: []
    };
  }

  async componentDidMount() {
    await this.props.suggestionEngine.healthCheck(
      ({ googleAddressServiceIsAvailable }) => {
        this.setState({
          suggestionServiceAvailable: googleAddressServiceIsAvailable
        });
      }
    );
  }

  renderInput = inputProps => {
    const {
      label,
      classes,
      ref,
      dataTest,
      reduxFormMeta,
      ...other
    } = inputProps;
    const shouldRenderError = Boolean(reduxFormMeta.error);

    if (!this.state.suggestionServiceAvailable) {
      return (
        <TextField
          disabled={true}
          label={label}
          fullWidth
          InputProps={{
            classes: {
              input: classes.input
            },
            "data-test": dataTest,
            inputProps: {
              value: "Address lookup is down, please try again later"
            }
          }}
        />
      );
    }
    return (
      <TextField
        label={label}
        fullWidth
        inputRef={ref}
        InputProps={{
          classes: {
            input: classes.input
          },
          "data-test": dataTest,
          ...other
        }}
        error={shouldRenderError}
        helperText={reduxFormMeta.error}
        FormHelperTextProps={{
          error: shouldRenderError
        }}
        InputLabelProps={{
          shrink: true
        }}
        placeholder={"Search for an Address"}
      />
    );
  };

  renderSuggestionsContainer = options => {
    const { containerProps, children } = options;
    return (
      <Paper {...containerProps} data-test="suggestion-container" square>
        {children}
        {children ? (
          <div align="right">
            <img alt="Powered by Google" src={poweredByGoogle} height="20px" />
          </div>
        ) : null}
      </Paper>
    );
  };

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const suggestionValue = this.props.suggestionEngine.getSuggestionValue(
      suggestion
    );
    const matches = match(suggestionValue, query);
    const parts = parse(suggestionValue, matches);

    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  };

  getSuggestionValue = suggestion => {
    return this.props.suggestionEngine.getSuggestionValue(suggestion);
  };

  handleValidatedAddress = address => {
    this.props.onInputChanged(formatAddress(address));
    this.setState({ selectedAutoSuggest: true });

    this.props.change(
      this.props.formName,
      `${this.props.fieldName}.streetAddress`,
      address.streetAddress
    );
    this.props.change(
      this.props.formName,
      `${this.props.fieldName}.intersection`,
      address.intersection
    );
    this.props.change(
      this.props.formName,
      `${this.props.fieldName}.city`,
      address.city
    );
    this.props.change(
      this.props.formName,
      `${this.props.fieldName}.state`,
      address.state
    );
    this.props.change(
      this.props.formName,
      `${this.props.fieldName}.zipCode`,
      address.zipCode
    );
    this.props.change(
      this.props.formName,
      `${this.props.fieldName}.country`,
      address.country
    );
  };

  showAddressLookupError = message => {
    this.props.snackbarError(message);
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.suggestionEngine.onSuggestionSelected(
      suggestion,
      this.handleValidatedAddress,
      this.showAddressLookupError
    );
  };

  handleSuggestionsFetchRequested = ({ value, reason }) => {
    if (value && reason === "input-changed") {
      this.props.suggestionEngine.onFetchSuggestions(value, values => {
        this.setState({
          suggestions: values || []
        });
      });
    }
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = (event, { newValue }) => {
    this.props.onInputChanged(newValue);
    this.setState({ inputValue: newValue });
    this.setState({ selectedAutoSuggest: false });

    if (!newValue) {
      this.props.change(
        this.props.formName,
        `${this.props.fieldName}.streetAddress`,
        ""
      );
      this.props.change(
        this.props.formName,
        `${this.props.fieldName}.intersection`,
        ""
      );
      this.props.change(
        this.props.formName,
        `${this.props.fieldName}.city`,
        ""
      );
      this.props.change(
        this.props.formName,
        `${this.props.fieldName}.state`,
        ""
      );
      this.props.change(
        this.props.formName,
        `${this.props.fieldName}.zipCode`,
        ""
      );
      this.props.change(
        this.props.formName,
        `${this.props.fieldName}.country`,
        ""
      );
    }

    this.props.clearSubmitErrors(this.props.formName);
  };

  render() {
    const {
      label,
      classes = {},
      meta,
      inputProps,
      "data-test": dataTest
    } = this.props;

    const theme = {
      container: classes.container,
      suggestionsContainerOpen: classes.suggestionsContainerOpen,
      suggestionsList: classes.suggestionsList,
      suggestion: classes.suggestion
    };

    return (
      <Autosuggest
        theme={theme}
        renderInputComponent={this.renderInput}
        suggestions={this.state.suggestions}
        onSuggestionSelected={this.onSuggestionSelected}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        data-test={"base-auto-suggest"}
        inputProps={{
          label,
          dataTest,
          ...inputProps,
          classes,
          reduxFormMeta: meta,
          value: this.state.inputValue,
          onChange: this.handleChange,
          onBlur: this.props.onBlur(
            this.state.selectedAutoSuggest,
            this.state.inputValue
          )
        }}
      />
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    change: (...params) => {
      dispatch(change(...params));
    },
    clearSubmitErrors: (...params) => {
      dispatch(clearSubmitErrors(...params));
    },
    onInputChanged: (...params) => {
      dispatch(ownProps.onInputChanged(...params));
    },
    snackbarError: (...params) => {
      dispatch(snackbarError(...params));
    }
  };
};

const ConnectedComponent = connect(undefined, mapDispatchToProps)(
  AddressAutoSuggest
);
export default withStyles(styles)(ConnectedComponent);
