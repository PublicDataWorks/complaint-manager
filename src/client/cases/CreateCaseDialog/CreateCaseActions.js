import React from 'react';
import { connect } from "react-redux";
import { reset, SubmissionError } from "redux-form";
import { DialogActions } from '@material-ui/core'
import LinkButton from "../../shared/components/LinkButton";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import { withTheme } from "@material-ui/core/styles";
import createCase from "../thunks/createCase";
import { atLeastOneRequired } from "../../formValidations";
import { closeCreateCaseDialog } from "../../actionCreators/casesActionCreators"
import { applyCentralTimeZoneOffset } from "../../utilities/formatDate";
import { isEmpty } from 'lodash'

export class CreateCaseActions extends React.Component {
  closeDialog = () => {
    this.props.closeCreateCaseDialog();
    this.props.reset("CreateCase");
  }

  createAndView = (values) =>
    this.createNewCase(values, true)

  createOnly = (values) =>
    this.createNewCase(values, false)

  createAndSearch = (values) =>
    this.createNewCase(values, true)

  createNewCase = ({civilian, case: theCase}, redirect) =>
    this.props.createCase({
      caseDetails: {
        case: this.prepareCase(theCase),
        ...(civilian
            && this.isValid(civilian)
            && this.prepareCivilian(civilian))
      },
      redirect
    })

  prepareCase = theCase => ({
    ...theCase,
    incidentDate: applyCentralTimeZoneOffset(theCase.incidentDate)
  })

  prepareCivilian = civilian => ({
    civilian: {
      ...civilian,
      firstName: civilian.firstName.trim(),
      lastName: civilian.lastName.trim()
    }
  })

  isValid = civilian => {
    const errors = validate(civilian);
    if (!isEmpty(errors))
      throw new SubmissionError({civilian: errors})
    return true
  }
  render() {
    const {theme, civilianComplainant, handleSubmit} = this.props
    return (
      <DialogActions
        style={{
          justifyContent: "space-between",
          margin: `${theme.spacing.unit * 2}px`
        }}
      >
        <SecondaryButton data-test="cancelCase" onClick={this.closeDialog}>
          Cancel
        </SecondaryButton>
        {civilianComplainant
         ? <CivilianComplainantButtons
             createCaseOnly={handleSubmit(this.createOnly)}
             createAndView={handleSubmit(this.createAndView)}
           />
         : <OfficerComplainantButtons
             createAndSearch={handleSubmit(this.createAndSearch)}
           />
        }
      </DialogActions>
    )
  }
}

const validate = civilian =>
  atLeastOneRequired(
    civilian,
    "Please enter phone number or email address",
    ["phoneNumber", "email"])

const CivilianComplainantButtons = ({createCaseOnly, createAndView}) =>
  <div>
    <LinkButton
      data-test="createCaseOnly"
      onClick={createCaseOnly}
      style={{ marginRight: "10px" }}
    >
      Create Only
    </LinkButton>
    <PrimaryButton data-test="createAndView" onClick={createAndView}>
      Create And View
    </PrimaryButton>
  </div>

const OfficerComplainantButtons = ({createAndSearch}) =>
  <PrimaryButton
    data-test="createAndSearch"
    onClick={createAndSearch}
  >
    Create and Search
  </PrimaryButton>

export const ActionsWithTheme = withTheme()(CreateCaseActions);
export default connect(
  null,
  {createCase, closeCreateCaseDialog, reset}
)(ActionsWithTheme)
