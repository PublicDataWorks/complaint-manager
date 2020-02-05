import Attachment from "../../../testUtilities/attachment";
import AttachmentsRow from "./AttachmentsRow";
import { expectEventuallyNotToExist } from "../../../../testHelpers";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../../createConfiguredStore";
import React from "react";
import { mount } from "enzyme";
import {
  CASE_STATUS,
  COMPLAINANT_LETTER,
  REFERRAL_LETTER
} from "../../../../../sharedUtilities/constants";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";

describe("AttachmentsRow", () => {
  let store;
  const attachmentReferralLetter = new Attachment.Builder()
    .defaultAttachment()
    .withFileName("referral letter.pdf")
    .withId(10)
    .withDescription(REFERRAL_LETTER)
    .build();

  const attachmentComplainantLetter = new Attachment.Builder()
    .defaultAttachment()
    .withFileName("complainant letter.pdf")
    .withId(10)
    .withDescription(COMPLAINANT_LETTER)
    .build();

  const attachment = new Attachment.Builder()
    .defaultAttachment()
    .withFileName("my letter.pdf")
    .withId(10)
    .build();

  beforeEach(() => {
    store = createConfiguredStore();
    const caseDetail = { isArchived: false };
    store.dispatch(getCaseDetailsSuccess(caseDetail));
  });

  test("should not have remove button when referral letter", () => {
    const wrapper = mount(
      <Provider store={store}>
        <AttachmentsRow attachment={attachmentReferralLetter} />
      </Provider>
    );
    const removeButton = wrapper.find('[data-testid="removeAttachmentButton"]');
    expect(removeButton.exists()).toEqual(false);
  });

  test("should not have remove button when conplainant letter", () => {
    const wrapper = mount(
      <Provider store={store}>
        <AttachmentsRow attachment={attachmentComplainantLetter} />
      </Provider>
    );
    const removeButton = wrapper.find('[data-testid="removeAttachmentButton"]');
    expect(removeButton.exists()).toEqual(false);
  });

  test("should not have remove button case is archived", () => {
    store.dispatch(getCaseDetailsSuccess({ isArchived: true }));

    const wrapper = mount(
      <Provider store={store}>
        <AttachmentsRow attachment={attachment} />
      </Provider>
    );

    const removeButton = wrapper.find('[data-testid="removeAttachmentButton"]');
    expect(removeButton.exists()).toEqual(false);
  });

  test("should have remove button when not archived or auto-generated", () => {
    const wrapper = mount(
      <Provider store={store}>
        <AttachmentsRow attachment={attachment} />
      </Provider>
    );
    const removeButton = wrapper.find('[data-testid="removeAttachmentButton"]');
    expect(removeButton.exists()).toEqual(true);
  });
});
