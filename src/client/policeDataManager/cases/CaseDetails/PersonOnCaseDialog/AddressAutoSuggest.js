import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { MenuItem, Paper, TextField } from "@material-ui/core";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import poweredByGoogle from "../../../../../assets/powered_by_google_on_white_hdpi.png";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import {
  updateAddressDisplayValue,
  updateAddressErrorMessage,
  updateAddressInputValidity,
  updateAddressToConfirm,
  updateShowAddressMessage
} from "../../../actionCreators/casesActionCreators";
import parseAddressFromGooglePlaceResult from "../../../utilities/parseAddressFromGooglePlaceResult";

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: "relative",
    width: "90%",
    marginBottom: "8px"
  },
  suggestionsContainerOpen: {
    position: "relative",
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
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
    this.props.updateAddressDisplayValue(props.defaultText || "");
    this.state = {
      googleAddressServiceIsAvailable: true,
      geocoderServiceIsAvailable: true,
      suggestions: [],
      suggestionSelected: true
    };
  }

  async componentDidMount() {
    await this.props.mapService.healthCheck(currentMapServiceIsAvailable => {
      this.setState(currentMapServiceIsAvailable);
    });
    this.props.updateAddressInputValidity(true);
    this.props.updateAddressErrorMessage("");
    this.props.updateShowAddressMessage(false);
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

    if (
      !this.state.googleAddressServiceIsAvailable ||
      !this.state.geocoderServiceIsAvailable
    ) {
      return (
        <TextField
          disabled={true}
          label={label}
          fullWidth
          InputProps={{
            classes: {
              input: classes.input
            },
            inputProps: {
              value: "Address lookup is down, please try again later",
              "data-testid": dataTest
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
          inputProps: { "data-testid": dataTest },
          ...other,
          autoComplete: "off" // "off" does not work on chrome
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
      <Paper
        elevation={2}
        {...containerProps}
        data-testid="suggestion-container"
        aria-label="suggestion"
        square
      >
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
    const suggestionValue = this.props.mapService.getSuggestionValue(
      suggestion
    );
    const matches = match(suggestionValue + "", query);
    const parts = parse(suggestionValue, matches);

    return (
      <MenuItem
        data-testid="suggestion-option"
        selected={isHighlighted}
        component="div"
      >
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
    return this.props.mapService.getSuggestionValue(suggestion);
  };

  handleValidatedAddress = (address, displayAddress) => {
    this.props.setFormValues(address);

    this.props.updateAddressDisplayValue(displayAddress);
  };

  showAddressLookupError = message => {
    this.props.updateAddressErrorMessage(
      "We could not find any matching addresses"
    );
    if (message) {
      this.props.snackbarError(message);
    }
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({ suggestionSelected: true });

    this.props.mapService.fetchAddressDetails(
      { placeId: suggestion.place_id },
      this.handleValidatedAddress,
      this.showAddressLookupError
    );
  };

  handleSuggestionsFetchRequested = ({ value, reason }) => {
    if (value && reason === "input-changed") {
      this.props.mapService.fetchSuggestions(value, values => {
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

  handleBlur = () => {
    this.props.updateShowAddressMessage(true);
    this.props.updateAddressErrorMessage("");
    if (
      !this.state.suggestionSelected &&
      this.props.addressDisplayValue.trim() !== ""
    ) {
      this.props.mapService.fetchAddressDetails(
        { address: this.props.addressDisplayValue },
        this.handleNonConfirmedValidAddress,
        this.showAddressLookupError
      );
    }
  };

  handleNonConfirmedValidAddress = address => {
    this.props.updateAddressToConfirm(address);
  };

  handleChange = (event, { newValue }) => {
    if (event.type === "change") {
      this.props.updateAddressDisplayValue(newValue);
      this.setState({ suggestionSelected: false });
      this.props.updateAddressToConfirm({});
      this.props.updateShowAddressMessage(false);
      if (newValue.trim() === "") {
        this.props.setFormValues(parseAddressFromGooglePlaceResult({}));
      } else {
        this.props.updateAddressInputValidity(false);
      }
    }
  };

  render() {
    const {
      label,
      classes = {},
      meta,
      inputProps,
      "data-testid": dataTest
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
        data-testid={"base-auto-suggest"}
        inputProps={{
          label,
          dataTest,
          ...inputProps,
          classes,
          reduxFormMeta: meta,
          value: this.props.addressDisplayValue,
          onChange: this.handleChange,
          onBlur: this.handleBlur
        }}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateAddressInputValidity: (...params) => {
      dispatch(updateAddressInputValidity(...params));
    },
    updateShowAddressMessage: (...params) => {
      dispatch(updateShowAddressMessage(...params));
    },
    updateAddressToConfirm: (...params) => {
      dispatch(updateAddressToConfirm(...params));
    },
    updateAddressDisplayValue: (...params) => {
      dispatch(updateAddressDisplayValue(...params));
    },
    updateAddressErrorMessage: (...params) => {
      dispatch(updateAddressErrorMessage(...params));
    },
    snackbarError: (...params) => {
      dispatch(snackbarError(...params));
    }
  };
};

const mapStateToProps = state => ({
  addressDisplayValue: state.ui.addressInput.addressDisplayValue
});

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressAutoSuggest);
export default withStyles(styles)(ConnectedComponent);
