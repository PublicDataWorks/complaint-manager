import {
  getFirstPageHeader,
  getFooterImage,
  getFooterText,
  getLetterContents,
  getSubsequentPageHeader,
  getTemplateHead,
  reassembleTemplate,
  getTemplateBody
} from "./letter-types-selectors";

const templateHead = `
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
`;

export const getInitialValuesForNew = commonProps => ({
  ...commonProps,
  templateHead,
  initialValues: {
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
});

// Selector or utility function for complaintTypeValues
export const computeComplaintTypeValues = (state, complaintTypes) => {
  return complaintTypes.reduce((acc, complaintType) => {
    acc[complaintType.name] =
      !state.ui.editLetterType.id ||
      !state.ui.editLetterType.complaintTypes?.length ||
      state.ui.editLetterType.complaintTypes?.includes(complaintType.name);
    return acc;
  }, {});
};

// Utility function for defaultRecipient and recipientNameInput logic
const computeDefaultRecipient = defaultRecipient => {
  return defaultRecipient !== "{primaryComplainant}" &&
    defaultRecipient !== "{eachComplainant}"
    ? "Other"
    : defaultRecipient;
};

// Main function to construct initialValues for edit scenario
export const getInitialValuesForEdit = (state, complaintTypeValues) => {
  const { editLetterType } = state.ui;
  const defaultRecipient = computeDefaultRecipient(
    editLetterType.defaultRecipient
  );

  return {
    ...complaintTypeValues,
    defaultSender: editLetterType.defaultSender?.nickname,
    defaultRecipient,
    defaultRecipientAddress: editLetterType.defaultRecipientAddress,
    editableTemplate: editLetterType.editableTemplate,
    firstPageHeader: getFirstPageHeader(state),
    footerImage: getFooterImage(state),
    footerText: getFooterText(state),
    hasEditPage: editLetterType.hasEditPage,
    letterTypeInput: editLetterType.type,
    recipientNameInput:
      defaultRecipient === "Other" ? editLetterType.defaultRecipient : "",
    recipientAddressInput:
      defaultRecipient === "Other"
        ? editLetterType.defaultRecipientAddress
        : "",
    requiredStatus: editLetterType.requiredStatus,
    requiresApproval: editLetterType.requiresApproval,
    subsequentPageHeader: getSubsequentPageHeader(state),
    template: getLetterContents(state)
  };
};

export const getCommonProps = state => ({
  bodyTemplate: state.form.letterTypeForm?.values?.editableTemplate,
  editable: state.form.letterTypeForm?.values?.hasEditPage,
  reassembledTemplate: reassembleTemplate(state), // Assuming reassembleTemplate is a predefined function
  signers: state.signers,
  statuses: state.ui.caseStatuses,
  complaintTypes: state.ui.complaintTypes,
  complaintTypesError: state.form.letterTypeForm?.submitErrors
    ? state.form.letterTypeForm?.submitErrors[state.ui.complaintTypes[0].name]
    : undefined,
  chooseDefaultRecipientFeature:
    state.featureToggles.chooseDefaultRecipientFeature
});
