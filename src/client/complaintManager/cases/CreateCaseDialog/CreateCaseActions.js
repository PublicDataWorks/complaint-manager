import React from "react";
import { connect } from "react-redux";
import { formValueSelector, reset, SubmissionError } from "redux-form";
import { DialogActions } from "@material-ui/core";
import LinkButton from "../../shared/components/LinkButton";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import { withTheme } from "@material-ui/core/styles";
import createCase from "../thunks/createCase";
import {
  addressMustBeValid,
  atLeastOneRequired
} from "../../../formValidations";
import { closeCreateDialog } from "../../../common/actionCreators/createDialogActionCreators";
import { applyCentralTimeZoneOffset } from "../../utilities/formatDate";
import { isEmpty } from "lodash";
import {
  CIVILIAN_INITIATED,
  CREATE_CASE_FORM_NAME
} from "../../../../sharedUtilities/constants";
import normalizeAddress from "../../utilities/normalizeAddress";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";

export class CreateCaseActions extends React.Component {
  closeDialog = () => {
    this.props.closeCreateCaseDialog(DialogTypes.CASE);
    this.props.reset(CREATE_CASE_FORM_NAME);
  };

  createAndView = values => this.createNewCase(values, true);

  createOnly = values => this.createNewCase(values, false);

  createAndSearch = values => this.createNewCase(values, true);

  createNewCase = ({ civilian, case: theCase }, redirect) => {
    if (this.props.complaintType !== CIVILIAN_INITIATED) {
      this.props.change("civilian", null);
      civilian = null;
    }
    this.props.createCase({
      caseDetails: {
        case: this.prepareCase(theCase),
        ...(civilian &&
          this.isValid(civilian, this.props.createCaseAddressInputFeature) &&
          this.prepareCivilian(civilian))
      },
      redirect,
      sorting: {
        sortBy: this.props.sortBy,
        sortDirection: this.props.sortDirection
      },
      pagination: {
        currentPage: this.props.currentPage
      }
    });
  };

  prepareCase = theCase => ({
    ...theCase,
    incidentDate: applyCentralTimeZoneOffset(theCase.incidentDate)
  });

  prepareCivilian = civilian => {
    let civilianData;
    if (this.props.createCaseAddressInputFeature) {
      civilianData = {
        ...civilian,
        firstName: civilian.firstName.trim(),
        lastName: civilian.lastName.trim(),
        address: normalizeAddress(civilian.address)
      };
    } else {
      civilianData = {
        ...civilian,
        firstName: civilian.firstName.trim(),
        lastName: civilian.lastName.trim()
      };
    }
    return {
      civilian: civilianData
    };
  };

  isValid = (civilian, createCaseAddressInputFeature = false) => {
    const errors = validate(civilian, createCaseAddressInputFeature);
    if (this.props.createCaseAddressInputFeature) {
      addressMustBeValid(this.props.addressValid, errors);
    }

    if (!isEmpty(errors)) throw new SubmissionError({ civilian: errors });

    return true;
  };
  render() {
    const { theme, handleSubmit, disabled } = this.props;
    return (
      <DialogActions
        style={{
          justifyContent: "space-between",
          margin: `${theme.spacing(2)}px`
        }}
      >
        <SecondaryButton data-test="cancelCase" onClick={this.closeDialog}>
          Cancel
        </SecondaryButton>
        {this.props.complaintType === CIVILIAN_INITIATED ? (
          <CivilianComplainantButtons
            createCaseOnly={handleSubmit(this.createOnly)}
            createAndView={handleSubmit(this.createAndView)}
            disabled={disabled}
          />
        ) : (
          <OfficerComplainantButtons
            createAndSearch={handleSubmit(this.createAndSearch)}
          />
        )}
      </DialogActions>
    );
  }
}

const validate = (civilian, createCaseAddressInputFeature) => {
  const errorMessage = createCaseAddressInputFeature
    ? "Please enter one form of contact"
    : "Please enter phone number or email address";
  const fieldsToValidate = createCaseAddressInputFeature
    ? ["phoneNumber", "email", "address"]
    : ["phoneNumber", "email"];

  return atLeastOneRequired(civilian, errorMessage, fieldsToValidate);
};

const CivilianComplainantButtons = ({
  createCaseOnly,
  createAndView,
  disabled
}) => (
  <div>
    <LinkButton
      data-test="createCaseOnly"
      onClick={createCaseOnly}
      style={{ marginRight: "10px" }}
      disabled={disabled}
    >
      Create Only
    </LinkButton>
    <PrimaryButton
      data-test="createAndView"
      onClick={createAndView}
      disabled={disabled}
    >
      Create And View
    </PrimaryButton>
  </div>
);

const OfficerComplainantButtons = ({ createAndSearch }) => (
  <PrimaryButton data-test="createAndSearch" onClick={createAndSearch}>
    Create and Search
  </PrimaryButton>
);

export const ActionsWithTheme = withTheme(CreateCaseActions);

const selector = formValueSelector(CREATE_CASE_FORM_NAME);

const mapStateToProps = state => ({
  civilian: selector(state, "civilian"),
  sortBy: state.ui.casesTable.sortBy,
  sortDirection: state.ui.casesTable.sortDirection,
  currentPage: state.cases.working.currentPage,
  addressValid: state.ui.addressInput.addressValid,
  createCaseAddressInputFeature:
    state.featureToggles.createCaseAddressInputFeature
});

const mapDispatchToProps = {
  createCase,
  closeCreateCaseDialog: closeCreateDialog,
  reset
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsWithTheme);
