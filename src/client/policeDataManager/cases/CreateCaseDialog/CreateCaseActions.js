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
import { applyCentralTimeZoneOffset } from "../../../../sharedUtilities/formatDate";
import { isEmpty } from "lodash";
import {
  CIVILIAN_INITIATED,
  CREATE_CASE_FORM_NAME,
  RANK_INITIATED,
  SHOW_FORM
} from "../../../../sharedUtilities/constants";
import normalizeAddress from "../../utilities/normalizeAddress";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";
import { getSelectedPersonType } from "../../globalData/person-type-selectors";

const {
  CIVILIAN_WITHIN_PD_INITIATED
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export class CreateCaseActions extends React.Component {
  closeDialog = () => {
    this.props.resetForm();
    this.props.closeCreateCaseDialog(DialogTypes.CASE);
    this.props.reset(CREATE_CASE_FORM_NAME);
  };

  createAndView = values => this.createNewCase(values, true);

  createOnly = values => this.createNewCase(values, false);

  createAndSearch = values => this.createNewCase(values, true);

  createNewCase = ({ civilian, case: theCase }, redirect) => {
    if (this.props.selectedPersonType.dialogAction !== SHOW_FORM) {
      this.props.change("civilian", null);
      civilian = null;
    }
    this.props.createCase({
      caseDetails: {
        case: this.prepareCase(theCase),
        ...(civilian &&
          this.isValid(civilian) &&
          this.prepareCivilian(civilian))
      },
      personType: this.props.selectedPersonType,
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

  prepareCase = theCase => {
    let complaintType = theCase.complaintType;
    if (!complaintType) {
      if (
        // this is all NOIPM specific
        this.props.selectedPersonType.employeeDescription === "Officer"
      ) {
        complaintType = RANK_INITIATED;
      } else if (this.props.selectedPersonType.isEmployee) {
        complaintType = CIVILIAN_WITHIN_PD_INITIATED;
      } else {
        complaintType = CIVILIAN_INITIATED;
      }
    }

    return {
      ...theCase,
      incidentDate: applyCentralTimeZoneOffset(theCase.incidentDate),
      complaintType
    };
  };

  prepareCivilian = civilian => {
    const civilianData = civilian.isUnknown
      ? {
          isAnonymous: true,
          isUnknown: true,
          personSubType: civilian.personSubType
        }
      : {
          ...civilian,
          isAnonymous: civilian.isAnonymous || civilian.isUnknown,
          firstName: civilian.firstName?.trim(),
          lastName: civilian.lastName?.trim(),
          address: normalizeAddress(civilian.address)
        };
    return {
      civilian: civilianData
    };
  };

  isValid = civilian => {
    if (civilian.isUnknown) {
      return true;
    } else {
      const errors = {};
      addressMustBeValid(this.props.addressValid, errors);
      if (!isEmpty(errors)) throw new SubmissionError({ civilian: errors });
      return true;
    }
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
        <SecondaryButton data-testid="cancelCase" onClick={this.closeDialog}>
          Cancel
        </SecondaryButton>
        {this.props.selectedPersonType?.dialogAction === SHOW_FORM ? (
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

const CivilianComplainantButtons = ({
  createCaseOnly,
  createAndView,
  disabled
}) => (
  <div>
    <LinkButton
      data-testid="createCaseOnly"
      onClick={createCaseOnly}
      style={{ marginRight: "10px" }}
      disabled={disabled}
    >
      Create Only
    </LinkButton>
    <PrimaryButton
      data-testid="createAndView"
      onClick={createAndView}
      disabled={disabled}
    >
      Create And View
    </PrimaryButton>
  </div>
);

const OfficerComplainantButtons = ({ createAndSearch }) => (
  <PrimaryButton data-testid="createAndSearch" onClick={createAndSearch}>
    Create and Search
  </PrimaryButton>
);

export const ActionsWithTheme = withTheme(CreateCaseActions);

const selector = formValueSelector(CREATE_CASE_FORM_NAME);

const mapStateToProps = (state, props) => ({
  addressValid: state.ui.addressInput.addressValid,
  civilian: selector(state, "civilian"),
  currentPage: state.cases.working.currentPage,
  selectedPersonType: getSelectedPersonType(state, props.complainantType),
  sortBy: state.ui.casesTable.sortBy,
  sortDirection: state.ui.casesTable.sortDirection
});

const mapDispatchToProps = {
  createCase,
  closeCreateCaseDialog: closeCreateDialog,
  reset
};
export default connect(mapStateToProps, mapDispatchToProps)(ActionsWithTheme);
