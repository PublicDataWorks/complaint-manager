import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Field,
  formValueSelector,
  reduxForm,
  SubmissionError,
  change
} from "redux-form";
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
import { formatAddressAsString } from "../../../utilities/formatAddress";
import validate from "./helpers/validateCivilianFields";
import {
  CIVILIAN_FORM_NAME,
  COMPLAINANT,
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

const styles = {
  dialogPaper: {
    minWidth: "40%",
    maxHeight: "calc(100% - 150px)"
  }
};

class CivilianDialog extends Component {
  componentDidMount() {
    this.props.getRaceEthnicityDropdownValues();
    this.props.getGenderIdentityDropdownValues();
    this.props.getCivilianTitleDropdownValues();
  }

  handleCivilian = (values, dispatch) => {
    if (!values.isUnknown) {
      const errors = addressMustBeValid(this.props.addressValid);

      if (errors.autoSuggestValue) {
        throw new SubmissionError(errors);
      }
      const contactErrors = validate(values);
      if (!_.isEmpty(contactErrors)) {
        throw new SubmissionError(contactErrors);
      }
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
            <CivilianFormFields />
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
            onClick={this.props.handleSubmit(this.handleCivilian)}
            disabled={this.props.submitting}
          >
            {this.props.submitButtonText}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const DialogWithTheme = withTheme(withStyles(styles)(CivilianDialog));

const connectedForm = reduxForm({
  form: CIVILIAN_FORM_NAME,
  onSubmitFail: scrollToFirstError
})(DialogWithTheme);

const mapStateToProps = state => ({
  open: state.ui.civilianDialog.open,
  submitAction: state.ui.civilianDialog.submitAction,
  title: state.ui.civilianDialog.title,
  submitButtonText: state.ui.civilianDialog.submitButtonText,
  addressValid: state.ui.addressInput.addressValid
});

const mapDispatchToProps = {
  getRaceEthnicityDropdownValues,
  getGenderIdentityDropdownValues,
  getCivilianTitleDropdownValues,
  change
};

export default connect(mapStateToProps, mapDispatchToProps)(connectedForm);
