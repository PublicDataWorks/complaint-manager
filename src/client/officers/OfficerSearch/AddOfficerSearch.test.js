import React from "react";
import { mount } from "enzyme";
import { initialize } from "redux-form";
import { AddOfficerSearch } from "./AddOfficerSearch";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import OfficerSearchContainer from "./OfficerSearchContainer";
import { COMPLAINANT } from "../../../sharedUtilities/constants";

describe("AddOfficerSearch", () => {
  test("should set up initialize with roleOnCase as complainant when coming from create case flow", () => {
    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <BrowserRouter>
          <AddOfficerSearch
            dispatch={jest.fn()}
            match={{ params: { id: "1" } }}
            currentCase={{ id: 1 }}
            location={{ search: "?role=Complainant" }}
          />
        </BrowserRouter>
      </Provider>
    );

    const officerSearchContainer = wrapper.find(OfficerSearchContainer);
    expect(officerSearchContainer.prop("initialize")).toEqual(
      initialize("OfficerDetails", { roleOnCase: COMPLAINANT })
    );
  });
});
