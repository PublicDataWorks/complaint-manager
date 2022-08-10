import createConfiguredStore from "../../../createConfiguredStore";
import {
  closeMissingComplainantDialog,
  openMissingComplainantDialog
} from "../../actionCreators/letterActionCreators";
import { Provider } from "react-redux";
import MissingComplainantDialog from "./MissingComplainantDialog";
import React from "react";
import { mount } from "enzyme";

describe("MissingComplainantDialog", () => {
  let wrapper, caseId, nextStatus, dispatchSpy, store, redirectUrl;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = 1;
    redirectUrl = "url";

    store.dispatch(openMissingComplainantDialog());
    wrapper = mount(
      <Provider store={store}>
        <MissingComplainantDialog />
      </Provider>
    );
  });

  test("should dispatch close and redirect to correct url", () => {
    const missingComplainantReturnButton = wrapper
      .find('[data-testid="close-missing-complainant-dialog"]')
      .first();
    expect(missingComplainantReturnButton.exists()).toBeDefined();
    missingComplainantReturnButton.simulate("click");
    expect(dispatchSpy).toHaveBeenCalledWith(
      closeMissingComplainantDialog()
    );
  });
});