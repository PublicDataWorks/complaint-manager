import React from "react";
import Attachments from "./Attachments";
import { mount } from "enzyme";
import Case from "../../../../../sharedTestHelpers/case";
import { containsText } from "../../../../testHelpers";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";

jest.mock("../../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("Attachments card", () => {
  let store;

  beforeEach(() => {
    store = createConfiguredStore();
  });

  test("should display attachments if they exist", () => {
    const caseDetail = new Case.Builder().defaultCase().build();
    const attachmentFileName = caseDetail.attachments[0].fileName;

    store.dispatch(getCaseDetailsSuccess(caseDetail));

    const wrapper = mount(
      <Provider store={store}>
        <Attachments />
      </Provider>
    );

    containsText(
      wrapper,
      'div[data-testid="attachmentsField"]',
      attachmentFileName
    );
  });

  test("should display no attachments is null", () => {
    const caseDetail = new Case.Builder()
      .defaultCase()
      .withAttachments(null)
      .build();

    store.dispatch(getCaseDetailsSuccess(caseDetail));

    const wrapper = mount(
      <Provider store={store}>
        <Attachments />
      </Provider>
    );

    containsText(
      wrapper,
      'div[data-testid="attachmentsField"]',
      "No files are attached"
    );
  });

  test("should display no attachments if attachments is empty list", () => {
    const caseDetail = new Case.Builder()
      .defaultCase()
      .withAttachments([])
      .build();

    store.dispatch(getCaseDetailsSuccess(caseDetail));

    const wrapper = mount(
      <Provider store={store}>
        <Attachments />
      </Provider>
    );

    containsText(
      wrapper,
      'div[data-testid="attachmentsField"]',
      "No files are attached"
    );
  });
});
