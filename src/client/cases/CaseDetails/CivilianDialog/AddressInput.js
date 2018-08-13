import React, { Component } from "react";
import { TextField } from "redux-form-material-ui";
import AddressAutoSuggest from "./AddressAutoSuggest";
import { change, Field, clearSubmitErrors } from "redux-form";
import { connect } from "react-redux";
import colors from "../../../globalStyling/colors";
import AddressSuggestionEngine from "./SuggestionEngines/addressSuggestionEngine";
import formatAddress from "../../../utilities/formatAddress";
import _ from "lodash";

class AddressInput extends Component {
  //TODO  IS there a good way to do dependency injection in react/redux?
  // It's generally poor form to have a default service instance.
  // Would it be a bad idea to have a set of services defined in some corner of Redux
  // that would be set differently based on the environment?
  constructor(props) {
    super(props);
    this.suggestionEngine =
      props.suggestionEngine || new AddressSuggestionEngine();
    this.state = { validAddress: false };
  }

  renderValidMessage = () => {
    if (
      !this.props.featureToggles ||
      !this.props.featureToggles.addressIntersections ||
      !this.props.addressMessageVisible
    ) {
      return null;
    }

    let message, color;
    if (this.props.addressValid) {
      color = colors.green;
      message = <span>This is a valid address.</span>;
    } else if (!_.isEmpty(this.props.addressToConfirm)) {
      color = colors.red;
      message = (
        <span>
          Did you mean <b>{formatAddress(this.props.addressToConfirm)}</b>
        </span>
      );
    }
    return (
      <div
        style={{
          fontSize: "0.75rem",
          textAlign: "left",
          marginTop: "8px",
          color: color
        }}
      >
        {message}
      </div>
    );
  };

  setFormValues = address => {
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
    this.props.clearSubmitErrors(this.props.formName);
  };

  render() {
    return (
      <div>
        <Field
          name="autoSuggestValue"
          component={AddressAutoSuggest}
          props={{
            label: this.props.addressLabel,
            suggestionEngine: this.suggestionEngine,
            defaultText: this.props.formattedAddress,
            "data-test": "addressSuggestionField",
            setFormValues: this.setFormValues
          }}
        />
        {this.renderValidMessage()}
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.streetAddress`}
          component={TextField}
          inputProps={{
            "data-test": "streetAddressInput"
          }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.intersection`}
          component={TextField}
          inputProps={{
            "data-test": "streetAddressInput"
          }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.city`}
          component={TextField}
          inputProps={{
            "data-test": "cityInput"
          }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.state`}
          component={TextField}
          inputProps={{
            "data-test": "stateInput"
          }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.zipCode`}
          component={TextField}
          inputProps={{
            "data-test": "zipCodeInput"
          }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.country`}
          component={TextField}
          inputProps={{
            "data-test": "countryInput"
          }}
        />
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    change: (...params) => {
      dispatch(change(...params));
    },
    clearSubmitErrors: (...params) => {
      dispatch(clearSubmitErrors(...params));
    }
  };
};

const mapStateToProps = state => ({
  addressValid: state.ui.addressInput.addressValid,
  addressMessageVisible: state.ui.addressInput.addressMessageVisible,
  addressToConfirm: state.ui.addressInput.addressToConfirm,
  featureToggles: state.featureToggles
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressInput);
