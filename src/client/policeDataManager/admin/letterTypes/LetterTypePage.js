import { FormControlLabel, Typography, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import {
  defaultSenderNotBlank,
  defaultSenderRequired,
  letterTypeNotBlank,
  letterTypeRequired,
  statusNotBlank,
  statusRequired
} from "../../../formFieldLevelValidations";
import NavBar from "../../shared/components/NavBar/NavBar";
import { policeDataManagerMenuOptions } from "../../shared/components/NavBar/policeDataManagerMenuOptions";
import { renderTextField } from "../../cases/sharedFormComponents/renderFunctions";
import PrimaryCheckBox from "../../shared/components/PrimaryCheckBox";
import Dropdown from "../../../common/components/Dropdown";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import { RichTextEditorComponent } from "../../shared/components/RichTextEditor/RichTextEditor";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import {
  snackbarSuccess,
  snackbarError
} from "../../actionCreators/snackBarActionCreators";
import axios from "axios";
import { CLEAR_LETTER_TYPE_TO_EDIT } from "../../../../sharedUtilities/constants";
import { withRouter } from "react-router";
import { separateTemplateHeadFromBody } from "./letter-types-selectors";

const styles = {
  labelStart: {
    justifyContent: "flex-end",
    marginLeft: "0px",
    whiteSpace: "nowrap"
  },
  inputColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
  }
};

const LetterTypePage = props => {
  const submit = values => {
    axios
      .put(`/api/letter-types/${props.letterTypeId}`, {
        type: values.letterTypeInput,
        template: `<html>
          <head>
            ${props.templateHead}
          </head>
          <body>
            <div id="pageHeader-first">${values.firstPageHeader}</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">${values.subsequentPageHeader}</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">${values.footerImage}</span>
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">${values.footerText}</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            ${values.template}
          </body>
        </html>`,
        hasEditPage: values.hasEditPage,
        requiresApproval: values.requiresApproval,
        defaultSender: values.defaultSender,
        requiredStatus: values.requiredStatus,
        editableTemplate: values.hasEditPage
          ? values.editableTemplate
          : undefined
      })
      .then(result => {
        props.snackbarSuccess("Successfully edited letter type");
        exit();
      })
      .catch(error => {
        props.snackbarError("Failed to edit letter type");
        console.error(error);
      });
  };

  const exit = () => {
    props.dispatch({ type: CLEAR_LETTER_TYPE_TO_EDIT });
    props.history.push("/admin-portal");
  };

  return (
    <>
      <NavBar menuType={policeDataManagerMenuOptions}>Admin Portal</NavBar>
      <main style={{ margin: "5px 30px" }}>
        <form onSubmit={props.handleSubmit(submit)} role="form">
          <Typography variant="h6">Edit Letter Type</Typography>
          <section
            className="input-section"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "45em"
            }}
          >
            <FormControlLabel
              label="Letter Type"
              labelPlacement="start"
              className={props.classes.labelStart}
              control={
                <Field
                  component={renderTextField}
                  inputProps={{ "data-testid": "letter-type-input" }}
                  name="letterTypeInput"
                  placeholder="Letter Type"
                  style={{ marginLeft: "10px" }}
                  validate={[letterTypeRequired, letterTypeNotBlank]}
                />
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: "125px",
                flexWrap: "wrap"
              }}
            >
              <div className={props.classes.inputColumn}>
                <FormControlLabel
                  label="Requires Approval"
                  control={
                    <Field
                      component={PrimaryCheckBox}
                      inputProps={{
                        "data-testid": "requires-approval-checkbox"
                      }}
                      name="requiresApproval"
                    />
                  }
                />
                <FormControlLabel
                  label="Is Editable"
                  control={
                    <Field
                      component={PrimaryCheckBox}
                      inputProps={{ "data-testid": "edit-page-checkbox" }}
                      name="hasEditPage"
                    />
                  }
                />
              </div>
              <div
                className={props.classes.inputColumn}
                style={{
                  flexGrow: 4,
                  minWidth: "400px"
                }}
              >
                <FormControlLabel
                  label="Default Sender"
                  labelPlacement="start"
                  className={props.classes.labelStart}
                  control={
                    <Field
                      component={Dropdown}
                      inputProps={{ "data-testid": "default-sender-dropdown" }}
                      name="defaultSender"
                      placeholder="Default Sender"
                      required
                      validate={[defaultSenderRequired, defaultSenderNotBlank]}
                      style={{ width: "100%", marginLeft: "10px" }}
                    >
                      {generateMenuOptions(
                        props.signers.map(signer => [
                          signer.name,
                          signer.nickname
                        ])
                      )}
                    </Field>
                  }
                />
                <FormControlLabel
                  label="Required Status"
                  labelPlacement="start"
                  className={props.classes.labelStart}
                  control={
                    <Field
                      component={Dropdown}
                      inputProps={{ "data-testid": "required-status-dropdown" }}
                      name="requiredStatus"
                      placeholder="Required Status"
                      required
                      validate={[statusRequired, statusNotBlank]}
                      style={{ width: "100%", marginLeft: "10px" }}
                    >
                      {generateMenuOptions(
                        props.statuses.map(status => status.name)
                      )}
                    </Field>
                  }
                />
              </div>
            </div>
            <section
              style={{
                padding: "10px 0px"
              }}
            >
              <label htmlFor="first-page-header">First Page Header</label>
              <Field
                name="firstPageHeader"
                label="First Page Header"
                id="first-page-header"
                component={RichTextEditorComponent}
                placeholder="Enter First Page Header"
                fullWidth
                multiline
                rowsMax={20}
                rows={5}
                style={{
                  color: "black"
                }}
              />
            </section>
            <section
              style={{
                padding: "10px 0px"
              }}
            >
              <label htmlFor="subsequent-page-header">
                Subsequent Page Header
              </label>
              <Field
                name="subsequentPageHeader"
                label="Subsequent Page Header"
                id="subsequent-page-header"
                component={RichTextEditorComponent}
                placeholder="Enter Subsequent Page Header"
                fullWidth
                multiline
                rowsMax={20}
                rows={5}
                style={{
                  color: "black"
                }}
              />
            </section>
            <section
              style={{
                padding: "10px 0px"
              }}
            >
              <label htmlFor="footer-image">Footer Image</label>
              <Field
                name="footerImage"
                label="Footer Image"
                id="footer-image"
                component={RichTextEditorComponent}
                placeholder="Enter Footer Image"
                fullWidth
                multiline
                rowsMax={20}
                rows={5}
                style={{
                  color: "black"
                }}
              />
            </section>
            <section
              style={{
                padding: "10px 0px"
              }}
            >
              <label htmlFor="footer-text">Footer Text</label>
              <Field
                name="footerText"
                label="Footer Text"
                id="footer-text"
                component={RichTextEditorComponent}
                placeholder="Enter Footer Text"
                fullWidth
                multiline
                rowsMax={20}
                rows={5}
                style={{
                  color: "black"
                }}
              />
            </section>
            <section
              style={{
                padding: "10px 0px"
              }}
            >
              <label htmlFor="template-field">Template</label>
              <Field
                name="template"
                label="Template"
                id="template-field"
                component={RichTextEditorComponent}
                placeholder="Enter Letter Template"
                fullWidth
                multiline
                rowsMax={20}
                rows={5}
                style={{
                  color: "black"
                }}
              />
            </section>
            {props.editable ? (
              <section
                style={{
                  padding: "10px 0px"
                }}
              >
                <label htmlFor="body-template-field">Body Template</label>
                <Field
                  name="editableTemplate"
                  label="Editable Template"
                  id="body-template-field"
                  component={RichTextEditorComponent}
                  placeholder="Enter Letter Editable Template"
                  fullWidth
                  multiline
                  rowsMax={20}
                  rows={5}
                  style={{
                    color: "black"
                  }}
                />
              </section>
            ) : (
              ""
            )}
            <section
              style={{
                paddingBottom: "20px",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <SecondaryButton onClick={exit}>Cancel</SecondaryButton>
              <span style={{ width: "10px" }}></span>
              <PrimaryButton data-testid="saveButton">Save</PrimaryButton>
            </section>
          </section>
        </form>
      </main>
    </>
  );
};

export default connect(
  state => {
    const template = separateTemplateHeadFromBody(state);

    return {
      editable: state.form.letterTypeForm?.values?.hasEditPage,
      initialValues: {
        letterTypeInput: state.ui.editLetterType.type,
        requiresApproval: state.ui.editLetterType.requiresApproval,
        hasEditPage: state.ui.editLetterType.hasEditPage,
        defaultSender: state.ui.editLetterType.defaultSender?.nickname,
        requiredStatus: state.ui.editLetterType.requiredStatus,
        template: template.body,
        editableTemplate: state.ui.editLetterType.editableTemplate,
        firstPageHeader: template.firstPageHeader,
        subsequentPageHeader: template.subsequentPageHeader,
        footerText: template.footerText,
        footerImage: template.footerImage
      },
      letterTypeId: state.ui.editLetterType.id,
      signers: state.signers,
      statuses: state.ui.caseStatuses,
      templateHead: template.head
    };
  },
  { snackbarSuccess, snackbarError }
)(
  reduxForm({ form: "letterTypeForm" })(
    withStyles(styles)(withRouter(LetterTypePage))
  )
);
