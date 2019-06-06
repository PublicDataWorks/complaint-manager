import createConfiguredStore from "../../../createConfiguredStore";
import CaseTags from "./CaseTags";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { mount } from "enzyme";
import { containsText } from "../../../testHelpers";
import { openCaseTagDialog } from "../../../../client/actionCreators/casesActionCreators";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";

describe("Case Tags", () => {
  let dialog, dispatchSpy, store;

  beforeEach(() => {
    store = createConfiguredStore();

    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(
      getFeaturesSuccess({
        caseTaggingFeature: true
      })
    );

    dialog = mount(
      <Provider store={store}>
        <Router>
          <CaseTags />
        </Router>
      </Provider>
    );

    dispatchSpy.mockClear();
  });

  test("should display button to add tag", () => {
    containsText(dialog, '[data-test="addTagButton"]', "+ Add Tag");
  });

  test("should display placeholder text", () => {
    containsText(
      dialog,
      '[data-test="caseTagsContainer"]',
      "No tags have been added"
    );
  });

  test("add tag button should call openCaseTagDialog when clicked", () => {
    const addTagButton = dialog.find('button[data-test="addTagButton"]');
    addTagButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(openCaseTagDialog());
  });
});
