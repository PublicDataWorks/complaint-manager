import DownloadFinalLetterButton from "./DownloadFinalLetterButton";
import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { mount } from "enzyme";
import inBrowserDownload from "../../thunks/inBrowserDownload";
import { startLetterDownload } from "../../../actionCreators/letterActionCreators";
import { containsText } from "../../../testHelpers";

jest.mock(
  "../../thunks/inBrowserDownload",
  () => (apiRoute, anchorId, callback) => {
    return {
      type: "SUCCESS",
      apiRoute,
      anchorId,
      callback
    };
  }
);

describe("DownloadFinalLetterButton", () => {
  let wrapper, store, dispatchSpy, caseId;
  beforeEach(() => {
    caseId = 8;
    store = createConfiguredStore();
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.FORWARDED_TO_AGENCY,
        nextStatus: CASE_STATUS.CLOSED,
        pdfAvailable: true
      })
    );
    dispatchSpy = jest.spyOn(store, "dispatch");
    wrapper = mount(
      <Provider store={store}>
        <DownloadFinalLetterButton />
      </Provider>
    );
  });

  test("does not show button if case is prior to forwarded to agency", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: CASE_STATUS.INITIAL,
        nextStatus: CASE_STATUS.ACTIVE
      })
    );
    wrapper.update();
    const button = wrapper.find("[data-test='download-final-letter-button']");
    expect(button.exists()).toBeFalsy();
  });

  test("renders button if case is in forwarded to agency status (or closed)", () => {
    const button = wrapper
      .find("[data-test='download-final-letter-button']")
      .first();
    expect(button.exists()).toBeTruthy();
  });

  test("should dispatch inBrowserDownload with correct params on button click", () => {
    const button = wrapper
      .find("[data-test='download-final-letter-button']")
      .first();
    button.simulate("click");

    const apiRoute = `api/cases/${caseId}/referral-letter/final-pdf-url`;
    expect(dispatchSpy).toHaveBeenCalledWith(
      inBrowserDownload(
        apiRoute,
        "dynamicLetterDownloadLink",
        expect.any(Function)
      )
    );
  });

  test("should start download progress indicator on click button", () => {
    const button = wrapper
      .find("[data-test='download-final-letter-button']")
      .first();
    button.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(startLetterDownload());
  });

  test("download letter button disabled when download in progress", () => {
    const buttonBeforeClick = wrapper
      .find("[data-test='download-final-letter-button']")
      .first();
    buttonBeforeClick.simulate("click");
    wrapper.update();
    const buttonAfterClick = wrapper
      .find("[data-test='download-final-letter-button']")
      .first();
    expect(buttonAfterClick.props().disabled).toEqual(true);
  });

  test("download letter button enabled when no download in progress", () => {
    const buttonBeforeClick = wrapper
      .find("[data-test='download-final-letter-button']")
      .first();
    expect(buttonBeforeClick.props().disabled).toEqual(false);
  });

  test("does not display no file for download message if there is a file available", () => {
    const noFileForDownloadMessage = wrapper.find(
      "[data-test='no-file-for-download-message']"
    );
    expect(noFileForDownloadMessage.length).toEqual(0);
  });

  test("download letter button is disabled and shows message when there is no file for download", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.FORWARDED_TO_AGENCY,
        nextStatus: CASE_STATUS.CLOSED,
        pdfAvailable: false
      })
    );
    wrapper.update();
    const downloadButton = wrapper
      .find("[data-test='download-final-letter-button']")
      .first();
    expect(downloadButton.props().disabled).toEqual(true);

    containsText(
      wrapper,
      "[data-test='no-file-for-download-message']",
      "This case does not have a letter for download"
    );
  });
});
