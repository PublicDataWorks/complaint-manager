import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, SubmissionError, change } from "redux-form";
import { push } from "connected-react-router";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  Typography,
  withStyles
} from "@material-ui/core";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";
import { closeEditCivilianDialog } from "../../../actionCreators/casesActionCreators";
import { withTheme } from "@material-ui/core/styles";
import validate from "./helpers/validateCivilianFields";
import {
  CIVILIAN_FORM_NAME,
  COMPLAINANT,
  SHOW_FORM,
  WITNESS
} from "../../../../../sharedUtilities/constants";
import { nullifyFieldUnlessValid } from "../../../utilities/fieldNormalizers";
import { addressMustBeValid } from "../../../../formValidations";
import _ from "lodash";
import normalizeAddress from "../../../utilities/normalizeAddress";
import getRaceEthnicityDropdownValues from "../../../raceEthnicities/thunks/getRaceEthnicityDropdownValues";
import getGenderIdentityDropdownValues from "../../../genderIdentities/thunks/getGenderIdentityDropdownValues";
import getCivilianTitleDropdownValues from "../../../civilianTitles/thunks/getCivilianTitleDropdownValues";
import { renderRadioGroup } from "../../sharedFormComponents/renderFunctions";
import scrollToFirstError from "../../../../common/helpers/scrollToFirstError";
import CivilianFormFields from "./CivilianFormFields";
import PersonTypeSelection from "../../CreateCaseDialog/PersonTypeSelection";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const styles = {
  dialogPaper: {
    minWidth: "40%",
    maxHeight: "calc(100% - 150px)"
  }
};

class ComplainantWitnessDialog extends Component {
  componentDidMount() {
    this.props.getRaceEthnicityDropdownValues();
    this.props.getGenderIdentityDropdownValues();
    this.props.getCivilianTitleDropdownValues();
  }

  submit = (values, dispatch) => {
    if (
      !this.props.personType ||
      PERSON_TYPE[this.props.personType]?.createDialogAction === SHOW_FORM
    ) {
      this.handleCivilian(values, dispatch);
    } else {
      this.props.push(
        `/cases/${this.props.caseId}${
          PERSON_TYPE[this.props.personType]?.createDialogAction
        }`
      );
    }
  };

  handleCivilian = (values, dispatch) => {
    let personTypeErrors = {};
    if (this.props.choosePersonTypeInAddDialog && !values.personType) {
      personTypeErrors.personType = "Person Type is Required";
    }

    if (!values.isUnknown) {
      const errors = addressMustBeValid(this.props.addressValid);

      if (errors.autoSuggestValue) {
        throw new SubmissionError({ ...errors, ...personTypeErrors });
      }
      const contactErrors = validate(values);
      if (!_.isEmpty(contactErrors)) {
        throw new SubmissionError({ ...contactErrors, ...personTypeErrors });
      }
    }

    if (personTypeErrors.personType) {
      throw new SubmissionError(personTypeErrors);
    }

    dispatch(
      this.props.submitAction(
        values.isUnknown
          ? {
              caseId: values.caseId,
              isAnonymous: true,
              isUnknown: true,
              roleOnCase: values.roleOnCase
            }
          : {
              ...values,
              id: undefined,
              isAnonymous: !!values.isAnonymous,
              isUnknown: !!values.isUnknown,
              birthDate: nullifyFieldUnlessValid(values.birthDate),
              address: normalizeAddress(values.address)
            },
        values.id
      )
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open={this.props.open}
        classes={{ paper: classes.dialogPaper }}
        fullWidth
      >
        <DialogTitle data-testid="editDialogTitle">
          {this.props.title}
        </DialogTitle>
        <DialogContent style={{ padding: "0px 24px" }}>
          <form>
            <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
              Role On Case
            </Typography>
            <Field
              name="roleOnCase"
              component={renderRadioGroup}
              style={{ flexDirection: "row" }}
              data-testid="roleOnCaseRadioGroup"
            >
              <FormControlLabel
                style={{ marginRight: "48px" }}
                value={COMPLAINANT}
                control={<Radio color="primary" />}
                label={COMPLAINANT}
              />
              <FormControlLabel
                style={{ marginRight: "48px" }}
                value={WITNESS}
                control={<Radio color="primary" />}
                label={WITNESS}
              />
            </Field>
            {this.props.choosePersonTypeInAddDialog ? (
              <PersonTypeSelection
                selectedType={this.props.personType}
                subtypeFieldName="personSubType"
                typeFieldName="personType"
              />
            ) : (
              ""
            )}
            {!this.props.personType ||
            PERSON_TYPE[this.props.personType]?.createDialogAction ===
              SHOW_FORM ? (
              <CivilianFormFields />
            ) : (
              ""
            )}
          </form>
        </DialogContent>
        <DialogActions
          style={{
            justifyContent: "space-between",
            margin: `${this.props.theme.spacing(2)}px`
          }}
        >
          <SecondaryButton
            data-testid="cancelEditCivilian"
            onClick={() => this.props.dispatch(closeEditCivilianDialog())}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            data-testid="submitEditCivilian"
            onClick={this.props.handleSubmit(this.submit)}
            disabled={this.props.submitting}
          >
            {this.props.submitButtonText}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const DialogWithTheme = withTheme(withStyles(styles)(ComplainantWitnessDialog));

const connectedForm = reduxForm({
  form: CIVILIAN_FORM_NAME,
  onSubmitFail: scrollToFirstError
})(DialogWithTheme);

const mapStateToProps = state => {
  return {
    addressValid: state.ui.addressInput.addressValid,
    caseId: state.currentCase?.details?.id,
    choosePersonTypeInAddDialog:
      state.featureToggles.choosePersonTypeInAddDialog,
    open: state.ui.civilianDialog.open,
    personType: state.form[CIVILIAN_FORM_NAME]?.values?.personType,
    submitAction: state.ui.civilianDialog.submitAction,
    submitButtonText: state.ui.civilianDialog.submitButtonText,
    title: state.ui.civilianDialog.title
  };
};

const mapDispatchToProps = {
  change,
  getCivilianTitleDropdownValues,
  getGenderIdentityDropdownValues,
  getRaceEthnicityDropdownValues,
  push
};

export default connect(mapStateToProps, mapDispatchToProps)(connectedForm);
