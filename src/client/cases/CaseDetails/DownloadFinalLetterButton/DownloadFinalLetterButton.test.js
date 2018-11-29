import DownloadFinalLetterButton from "./DownloadFinalLetterButton";
import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { mount } from "enzyme";
import getFinalPdfUrl from "../../ReferralLetter/thunks/getFinalPdfUrl";

jest.mock("../../ReferralLetter/thunks/getFinalPdfUrl", () => caseId => ({
  type: "SUCCESS",
  caseId
}));

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

  test("should dispatch actions to start download and get download url on button click", () => {
    const button = wrapper
      .find("[data-test='download-final-letter-button']")
      .first();
    button.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(getFinalPdfUrl(caseId));
    //start download spinner
  });
});
