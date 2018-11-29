import DownloadFinalLetterButton from "./DownloadFinalLetterButton";
import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { mount } from "enzyme";
import config from "../../../config/config";
import inBrowserDownload from "../../thunks/inBrowserDownload";

jest.mock("../../thunks/inBrowserDownload", () => (apiRoute, linkAnchorId) => {
  return {
    type: "SUCCESS",
    apiRoute,
    anchorId: linkAnchorId
  };
});

describe("DownloadFinalLetterButton", () => {
  let wrapper, store, dispatchSpy, caseId;
  beforeEach(() => {
    caseId = 8;
    store = createConfiguredStore();
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.FORWARDED_TO_AGENCY,
        nextStatus: CASE_STATUS.CLOSED
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

    const apiRoute = `${
      config[process.env.NODE_ENV].hostname
    }/api/cases/${caseId}/referral-letter/final-pdf-url`;
    expect(dispatchSpy).toHaveBeenCalledWith(
      inBrowserDownload(apiRoute, "dynamicLetterDownloadLink")
    );
  });
});
