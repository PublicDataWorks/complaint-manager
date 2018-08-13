import React, { Component } from "react";
import { TextField } from "redux-form-material-ui";
import AddressAutoSuggest from "./AddressAutoSuggest";
import { change, Field, clearSubmitErrors } from "redux-form";
import { connect } from "react-redux";
import colors from "../../../globalStyling/colors";
import AddressSuggestionEngine from "./SuggestionEngines/addressSuggestionEngine";
import formatAddress from "../../../utilities/formatAddress";
import _ from "lodash";
import StyledLink from "../../../shared/components/StyledLink";
import {
  updateAddressDisplayValue,
  updateAddressInputValidity,
  updateAddressToConfirm
} from "../../../actionCreators/casesActionCreators";
import parseAddressFromGooglePlaceResult from "../../../utilities/parseAddressFromGooglePlaceResult";

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
      !this.props.addressMessageVisible ||
      this.props.addressDisplayValue.trim() === ""
    ) {
      return null;
    }

    if (this.props.addressValid) {
      return (
        <div
          style={{
            fontSize: "0.75rem",
            marginTop: "8px",
            color: colors.green
          }}
        >
          <span>This is a valid address</span>
        </div>
      );
    } else if (!_.isEmpty(this.props.addressToConfirm)) {
      return (
        <div
          style={{
            fontSize: "0.75rem",
            marginTop: "8px"
          }}
        >
          <span style={{ color: colors.red }}>
            Did you mean <b>{formatAddress(this.props.addressToConfirm)}</b>?
          </span>{" "}
          <StyledLink
            onClick={this.fillConfirmedAddress}
            to={"#"}
            style={{ fontSize: "0.75rem" }}
          >
            Fill Address
          </StyledLink>
        </div>
      );
    }
  };

  fillConfirmedAddress = () => {
    this.setFormValues(this.props.addressToConfirm);
    this.props.updateAddressDisplayValue(
      formatAddress(this.props.addressToConfirm)
    );
    this.props.updateAddressToConfirm(parseAddressFromGooglePlaceResult({}));
  };

  setFormValues = address => {
    this.props.updateAddressInputValidity(true);
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
    },
    updateAddressDisplayValue: (...params) => {
      dispatch(updateAddressDisplayValue(...params));
    },
    updateAddressToConfirm: (...params) => {
      dispatch(updateAddressToConfirm(...params));
    },
    updateAddressInputValidity: (...params) => {
      dispatch(updateAddressInputValidity(...params));
    }
  };
};

const mapStateToProps = state => ({
  addressValid: state.ui.addressInput.addressValid,
  addressMessageVisible: state.ui.addressInput.addressMessageVisible,
  addressToConfirm: state.ui.addressInput.addressToConfirm,
  featureToggles: state.featureToggles,
  addressDisplayValue: state.ui.addressInput.addressDisplayValue
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressInput);
