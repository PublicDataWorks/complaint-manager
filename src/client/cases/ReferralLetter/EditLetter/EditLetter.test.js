import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { getLetterPreviewSuccess } from "../../../actionCreators/letterActionCreators";
import getLetterPreview from "../thunks/getLetterPreview";
require("../../../testUtilities/MockMutationObserver");

jest.mock("../thunks/getLetterPreview", () => () => ({ type: "" }));

import EditLetter from "./EditLetter";

describe("Edit Letter Html", () => {
  let store, dispatchSpy, wrapper;

  const caseId = "102";
  const initialLetterHtml = "<p>Letter Preview HTML</p>";

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(
      getLetterPreviewSuccess(initialLetterHtml, {
        sender: "bob",
        recipient: "jane",
        transcribedBy: "joe"
      })
    );

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <EditLetter match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  test("load letter preview html and set it on the rtf editor when page is loaded", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getLetterPreview(caseId));

    const field = wrapper.find("Quill").first();
    expect(field.props().value).toEqual(initialLetterHtml);
  });
});
