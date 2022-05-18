import Attachment from "../../../../../sharedTestHelpers/attachment";
import AttachmentsRow from "./AttachmentsRow";
import { expectEventuallyNotToExist } from "../../../../testHelpers";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../../createConfiguredStore";
import React from "react";
import { mount } from "enzyme";
import {
  CASE_STATUS,
  COMPLAINANT_LETTER,
  REFERRAL_LETTER,
  USER_PERMISSIONS
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
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.EDIT_CASE] }
    });
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

  test("should have remove button when not archived", () => {
    const wrapper = mount(
      <Provider store={store}>
        <AttachmentsRow attachment={attachment} />
      </Provider>
    );
    const removeButton = wrapper.find('[data-testid="removeAttachmentButton"]');
    expect(removeButton.exists()).toEqual(true);
  });

  test("should not have remove button without permission", () => {
    let store = createConfiguredStore();
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.MANAGE_TAGS] }
    });

    const wrapper = mount(
      <Provider store={store}>
        <AttachmentsRow attachment={attachment} />
      </Provider>
    );
    const removeButton = wrapper.find('[data-testid="removeAttachmentButton"]');
    // expect(removeButton.exists()).toEqual(false);
    expect(removeButton).toHaveLength(0);
  });
});
