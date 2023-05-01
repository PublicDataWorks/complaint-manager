import {
  FormGroup,
  FormControlLabel,
  Typography,
  withStyles
} from "@material-ui/core";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, change, SubmissionError } from "redux-form";
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
import LinkButton from "../../shared/components/LinkButton";
import Dropdown from "../../../common/components/Dropdown";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import { RichTextEditorComponent } from "../../shared/components/RichTextEditor/RichTextEditor";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";
import { CLEAR_LETTER_TYPE_TO_EDIT } from "../../../../sharedUtilities/constants";
import { withRouter } from "react-router";
import {
  getFirstPageHeader,
  getFooterImage,
  getFooterText,
  getLetterContents,
  getSubsequentPageHeader,
  getTemplateHead,
  reassembleTemplate
} from "./letter-types-selectors";
import Collapser from "./Collapser";
import TemplatePreview from "./TemplatePreview";
import DefaultRecipient from "./DefaultRecipient";

const ADD = "add";
const EDIT = "edit";

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
  },
  sideBySideQuillContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    columnGap: "10px"
  },
  halfWidthQuill: {
    padding: "10px 0px",
    minWidth: "350px",
    flexGrow: "1"
  }
};

const LetterTypePage = props => {
  useEffect(
    () => () => props.dispatch({ type: CLEAR_LETTER_TYPE_TO_EDIT }),
    []
  );

  const submit = (operation, values) => {
    let complaintTypes = props.complaintTypes
      .filter(complaintType => values[complaintType.name])
      .map(complaintType => complaintType.name);

    if (!complaintTypes.length) {
      throw new SubmissionError({
        [props.complaintTypes[0].name]:
          "Please choose at least one complaint type"
      });
    }

    if (complaintTypes.length === props.complaintTypes.length) {
      complaintTypes = [];
    }

    const payload = {
      type: values.letterTypeInput,
      template: props.reassembledTemplate,
      hasEditPage: values.hasEditPage,
      requiresApproval: values.requiresApproval,
      defaultSender: values.defaultSender,
      defaultRecipient:
        values.defaultRecipient !== "{primaryComplainant}" &&
        values.defaultRecipient !== "{eachComplainant}"
          ? values.recipientNameInput
          : values.defaultRecipient,
      defaultRecipientAddress:
        values.defaultRecipient !== "{primaryComplainant}" &&
        values.defaultRecipient !== "{eachComplainant}"
          ? values.recipientAddressInput
          : values.defaultRecipientAddress,
      requiredStatus: values.requiredStatus,
      editableTemplate: values.hasEditPage
        ? values.editableTemplate
        : undefined,
      complaintTypes
    };

    let promise =
      operation === EDIT
        ? axios.put(`/api/letter-types/${props.letterTypeId}`, payload)
        : axios.post(`/api/letter-types`, payload);
    promise
      .then(result => {
        props.snackbarSuccess(`Successfully ${operation}ed letter type`);
        exit();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const exit = () => {
    props.history.push("/admin-portal");
  };

  return (
    <>
      <NavBar menuType={policeDataManagerMenuOptions}>Admin Portal</NavBar>
      <main style={{ margin: "5px 30px" }}>
        <form
          onSubmit={
            props.letterTypeId
              ? props.handleSubmit(values => submit(EDIT, values))
              : props.handleSubmit(values => submit(ADD, values))
          }
          role="form"
        >
          <Typography variant="h6">
            {props.letterTypeId ? "Edit Letter Type" : "Add Letter Type"}
          </Typography>
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

            <DefaultRecipient {...props} />

            <div
              style={{
                width: "100%",
                margin: "20px, 0px"
              }}
            >
              <Typography style={{ marginTop: "15px" }} variant="subtitle2">
                Complaint Type
              </Typography>
              <div
                style={{
                  display: "flex",
                  width: "50%"
                }}
              >
                <LinkButton
                  onClick={() =>
                    props.complaintTypes.forEach(complaintType => {
                      props.change(complaintType.name, true);
                    })
                  }
                >
                  <small>Select All</small>
                </LinkButton>
                <LinkButton
                  onClick={() =>
                    props.complaintTypes.forEach(complaintType => {
                      props.change(complaintType.name, false);
                    })
                  }
                >
                  <small>Deselect All</small>
                </LinkButton>
              </div>
              {props.complaintTypesError ? (
                <p style={{ color: "#d32f2f" }}>{props.complaintTypesError}</p>
              ) : (
                ""
              )}
              <FormGroup>
                <div>
                  {props.complaintTypes.map(complaintType => (
                    <FormControlLabel
                      style={{ width: "30%", minWidth: "300px" }}
                      key={complaintType.name}
                      label={complaintType.name}
                      control={
                        <Field
                          component={PrimaryCheckBox}
                          name={complaintType.name}
                        />
                      }
                    />
                  ))}
                </div>
              </FormGroup>
            </div>
            <Collapser name="Header">
              <section className={props.classes.sideBySideQuillContainer}>
                <section className={props.classes.halfWidthQuill}>
                  <label htmlFor="first-page-header">First Page Header</label>
                  <Field
                    name="firstPageHeader"
                    label="First Page Header"
                    id="first-page-header"
                    component={RichTextEditorComponent}
                    placeholder="Enter First Page Header"
                    fullWidth
                    multiline
                    rows={5}
                    style={{
                      color: "black"
                    }}
                  />
                </section>
                <section className={props.classes.halfWidthQuill}>
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
                    rows={5}
                    style={{
                      color: "black"
                    }}
                  />
                </section>
              </section>
            </Collapser>
            <Collapser name="Footer">
              <section className={props.classes.sideBySideQuillContainer}>
                <section className={props.classes.halfWidthQuill}>
                  <label htmlFor="footer-image">Footer Image</label>
                  <Field
                    name="footerImage"
                    label="Footer Image"
                    id="footer-image"
                    component={RichTextEditorComponent}
                    placeholder="Enter Footer Image"
                    fullWidth
                    multiline
                    rows={5}
                    style={{
                      color: "black"
                    }}
                  />
                </section>
                <section className={props.classes.halfWidthQuill}>
                  <label htmlFor="footer-text">Footer Text</label>
                  <Field
                    name="footerText"
                    label="Footer Text"
                    id="footer-text"
                    component={RichTextEditorComponent}
                    placeholder="Enter Footer Text"
                    fullWidth
                    multiline
                    rows={5}
                    style={{
                      color: "black"
                    }}
                  />
                </section>
              </section>
            </Collapser>
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
                  rows={5}
                  style={{
                    color: "black"
                  }}
                />
              </section>
            ) : (
              ""
            )}
            <TemplatePreview
              template={props.reassembledTemplate}
              bodyTemplate={props.bodyTemplate}
              type={props.initialValues.letterTypeInput}
            />
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
    const commonProps = {
      bodyTemplate: state.form.letterTypeForm?.values?.editableTemplate,
      editable: state.form.letterTypeForm?.values?.hasEditPage,
      reassembledTemplate: reassembleTemplate(state),
      signers: state.signers,
      statuses: state.ui.caseStatuses,
      complaintTypes: state.ui.complaintTypes,
      complaintTypesError: state.form.letterTypeForm?.submitErrors
        ? state.form.letterTypeForm?.submitErrors[
            state.ui.complaintTypes[0].name
          ]
        : undefined,
      chooseDefaultRecipientFeature:
        state.featureToggles.chooseDefaultRecipientFeature
    };

    const complaintTypeValues = commonProps.complaintTypes.reduce(
      (acc, complaintType) => {
        acc[complaintType.name] =
          !state.ui.editLetterType.id ||
          !state.ui.editLetterType.complaintTypes?.length ||
          state.ui.editLetterType.complaintTypes?.includes(complaintType.name);
        return acc;
      },
      {}
    );

    if (state.ui.editLetterType.id) {
      return {
        ...commonProps,
        initialValues: {
          ...complaintTypeValues,
          defaultSender: state.ui.editLetterType.defaultSender?.nickname,
          defaultRecipient:
            state.ui.editLetterType.defaultRecipient !==
              "{primaryComplainant}" &&
            state.ui.editLetterType.defaultRecipient !== "{eachComplainant}"
              ? "Other"
              : state.ui.editLetterType.defaultRecipient,
          defaultRecipientAddress:
            state.ui.editLetterType.defaultRecipientAddress,
          editableTemplate: state.ui.editLetterType.editableTemplate,
          firstPageHeader: getFirstPageHeader(state),
          footerImage: getFooterImage(state),
          footerText: getFooterText(state),
          hasEditPage: state.ui.editLetterType.hasEditPage,
          letterTypeInput: state.ui.editLetterType.type,
          recipientNameInput:
            state.ui.editLetterType.defaultRecipient !==
              "{primaryComplainant}" &&
            state.ui.editLetterType.defaultRecipient !== "{eachComplainant}"
              ? state.ui.editLetterType.defaultRecipient
              : "",
          recipientAddressInput:
            state.ui.editLetterType.defaultRecipient !==
              "{primaryComplainant}" &&
            state.ui.editLetterType.defaultRecipient !== "{eachComplainant}"
              ? state.ui.editLetterType.defaultRecipientAddress
              : "",
          requiredStatus: state.ui.editLetterType.requiredStatus,
          requiresApproval: state.ui.editLetterType.requiresApproval,
          subsequentPageHeader: getSubsequentPageHeader(state),
          template: getLetterContents(state)
        },
        letterTypeId: state.ui.editLetterType.id,
        templateHead: getTemplateHead(state)
      };
    } else {
      return {
        ...commonProps,
        templateHead: `
          <style>
            * {
              font-size: 8.5pt;
            }

            p {
              margin: 0;
            }

            .preserve-white-space {
              white-space: pre-wrap;
            }

            .ql-align-center {
              text-align: center;
            }
          </style>
        `,
        initialValues: {
          ...complaintTypeValues,
          firstPageHeader: `
            <div style="text-align: center;">
              {{{header}}}
            </div>
          `,
          subsequentPageHeader: `
            {{recipient}}<br/>
              {{{formatLongDate currentDate}}}<br/>
            Page \\{{page}}
          `,
          footerImage: `{{{smallIcon}}}`,
          footerText: `
            INDEPENDENT POLICE MONITOR <br />
            2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />
            Phone (504) 309-9799| Fax (504) 309-7345
          `,
          template: `
            <p style="color: #7F7F7F;">
              STELLA CZIMENT
              <br/>
              INDEPENDENT POLICE MONITOR
            </p>
            <p><br/></p>
            <p>
              {{{formatLongDate currentDate}}}
            </p>
            <p><br/></p>
              {{#if (isCivilianComplainant complainantPersonType)}}
            <p>
              {{recipient}}
                {{#if (isPresent (formatAddress recipientAddress))}}
                <p>{{{formatAddress recipientAddress}}}</p>
                {{/if}}
              {{#if (isPresent complainantEmail)}}
                <p>{{complainantEmail}}</p>
              {{/if}}
            </p>
            {{/if}}
            <p><br/></p>
            <p>Re: OIPM Complaint# {{caseReference}}</p>
            <p><br/></p>
            <p>Dear {{title}} {{recipient}},</p>
            <p><br/></p>
            <p>
              On {{{formatLongDate firstContactDate}}}, you contacted the Office of the Independent Police Monitor
              (OIPM) alleging possible misconduct by an officer of the New Orleans Police
              Department (NOPD or Department) for possible violations of several NOPD rules. As a
              result of your contact with us, OIPM No. {{caseReference}} was generated.
            </p>
            <p><br/></p>
            <p>
              Among other things, the OIPM takes complaints and examines the NOPD’s internal investigations system by conducting independent reviews of completed investigations into allegations of misconduct to determine whether they have been conducted appropriately. The OIPM does not conduct separate or new investigations.
            </p>
            <p><br/></p>
            <p>
              We forwarded the information you provided us to the NOPD’s Public Integrity Bureau
              (PIB) as an inquiry and asked that the matter be reviewed for possible violations of the
              NOPD rules and regulations. You may be contacted by a representative of PIB or by an
              NOPD supervisor regarding this matter.
            </p>
            <p><br/></p>
            <p>
              Please take into consideration that facts and/or allegations from your complaint may be
              used in future OIPM reports. If facts and/or allegations are used in future OIPM
              reports, names of witnesses, law enforcement, and complainants may be included. Once
              the review of your investigation has been completed, all or parts of the complaint may
              become public records.
            </p>
            <p><br/></p>
            <p>
              Enclosed you will find a copy of the OIPM letter to PIB and some information about
              our office. If you have any questions regarding the status of the information you
              provided, please contact us at (504) 309-9799 or via email at
              policemonitor@nolaipm.gov. Please refer to your OIPM No. {{caseReference}} when you
              contact our office.
            </p>
            <p><br/></p>
            <p><br/></p>
            Sincerely,
            <p><br></p>
            {{{signature}}}
            <p><br/></p>
            {{{renderHtml (newLineToLineBreak sender)}}}
          `
        }
      };
    }
  },
  { snackbarSuccess, change }
)(
  reduxForm({ form: "letterTypeForm" })(
    withStyles(styles)(withRouter(LetterTypePage))
  )
);
