import React, { Component } from "react";
import AddressAutoSuggest from "./AddressAutoSuggest";
import { change, clearSubmitErrors, Field } from "redux-form";
import { connect } from "react-redux";
import colors from "../../../../common/globalStyling/colors";
import MapService from "./MapServices/MapService";
import { formatAddressAsString } from "../../../utilities/formatAddress";
import _ from "lodash";
import StyledLink from "../../../shared/components/StyledLink";
import {
  updateAddressDisplayValue,
  updateAddressErrorMessage,
  updateAddressInputValidity,
  updateAddressToConfirm
} from "../../../actionCreators/casesActionCreators";
import parseAddressFromGooglePlaceResult from "../../../utilities/parseAddressFromGooglePlaceResult";
import { renderTextField } from "../../sharedFormComponents/renderFunctions";

class AddressInput extends Component {
  //TODO  IS there a good way to do dependency injection in react/redux?
  // It's generally poor form to have a default service instance.
  // Would it be a bad idea to have a set of services defined in some corner of Redux
  // that would be set differently based on the environment?
  constructor(props) {
    super(props);
    this.mapService = props.mapService || new MapService();
    this.state = { validAddress: false };
  }

  renderValidMessage = () => {
    if (
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
            Did you mean{" "}
            <b>{formatAddressAsString(this.props.addressToConfirm)}</b>?
          </span>{" "}
          <StyledLink
            onClick={this.fillConfirmedAddress}
            style={{ fontSize: "0.75rem", cursor: "pointer" }}
            data-test="fillAddressToConfirm"
          >
            Fill Address
          </StyledLink>
        </div>
      );
    } else {
      return (
        <div
          style={{
            fontSize: "0.75rem",
            marginTop: "8px",
            color: colors.red
          }}
        >
          <span>
            {this.props.addressErrorMessage
              ? this.props.addressErrorMessage
              : null}
          </span>
        </div>
      );
    }
  };

  fillConfirmedAddress = () => {
    this.setFormValues(this.props.addressToConfirm);
    this.props.updateAddressDisplayValue(
      formatAddressAsString(this.props.addressToConfirm)
    );
    this.props.updateAddressToConfirm(parseAddressFromGooglePlaceResult({}));
  };

  setFormValues = address => {
    this.props.updateAddressInputValidity(true);
    this.props.updateAddressErrorMessage("");
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
    this.props.change(
      this.props.formName,
      `${this.props.fieldName}.lat`,
      address.lat
    );
    this.props.change(
      this.props.formName,
      `${this.props.fieldName}.lng`,
      address.lng
    );
    this.props.change(
      this.props.formName,
      `${this.props.fieldName}.placeId`,
      address.placeId
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
            mapService: this.mapService,
            defaultText: this.props.formattedAddress,
            "data-test": "addressSuggestionField",
            setFormValues: this.setFormValues
          }}
        />
        {this.renderValidMessage()}
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.streetAddress`}
          component={renderTextField}
          inputProps={{
            "data-test": "streetAddressInput"
          }}
          style={{ display: "none" }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.intersection`}
          component={renderTextField}
          inputProps={{
            "data-test": "intersectionInput"
          }}
          style={{ display: "none" }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.city`}
          component={renderTextField}
          inputProps={{
            "data-test": "cityInput"
          }}
          style={{ display: "none" }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.state`}
          component={renderTextField}
          inputProps={{
            "data-test": "stateInput"
          }}
          style={{ display: "none" }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.zipCode`}
          component={renderTextField}
          inputProps={{
            "data-test": "zipCodeInput"
          }}
          style={{ display: "none" }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.country`}
          component={renderTextField}
          inputProps={{
            "data-test": "countryInput"
          }}
          style={{ display: "none" }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.lat`}
          component={renderTextField}
          inputProps={{
            "data-test": "latInput"
          }}
          style={{ display: "none" }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.lng`}
          component={renderTextField}
          inputProps={{
            "data-test": "lngInput"
          }}
          style={{ display: "none" }}
        />
        <Field
          type={"hidden"}
          name={`${this.props.fieldName}.placeId`}
          component={renderTextField}
          inputProps={{
            "data-test": "placeIdInput"
          }}
          style={{ display: "none" }}
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
    updateAddressErrorMessage: (...params) => {
      dispatch(updateAddressErrorMessage(...params));
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
  addressDisplayValue: state.ui.addressInput.addressDisplayValue,
  addressErrorMessage: state.ui.addressInput.addressErrorMessage
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressInput);
