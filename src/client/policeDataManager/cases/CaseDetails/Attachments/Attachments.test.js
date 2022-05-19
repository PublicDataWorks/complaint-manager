import React from "react";
import Attachments from "./Attachments";
import { mount } from "enzyme";
import Case from "../../../../../sharedTestHelpers/case";
import {
  containsText,
  expectEventuallyNotToExist
} from "../../../../testHelpers";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";

jest.mock("../../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("Attachments card", () => {
  let store;

  describe("without permissions", () => {
    beforeEach(() => {
      store = createConfiguredStore();
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.MANAGE_TAGS] }
      });
    });

    test("should not display UPLOAD A FILE", () => {
      const wrapper = mount(
        <Provider store={store}>
          <Attachments />
        </Provider>
      );

      expect(
        wrapper.find('[data-testid="file-upload-container"]')
      ).toHaveLength(0);
    });
  });

  describe("with permissions", () => {
    beforeEach(() => {
      store = createConfiguredStore();
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.EDIT_CASE] }
      });
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
});
