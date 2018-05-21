import React from "react";
import { mount, shallow } from "enzyme";
import ConnectedOfficerSearchResults, {
  OfficerSearchResults
} from "./OfficerSearchResults";
import getCaseDetails from "../../../cases/thunks/getCaseDetails";
import createConfiguredStore from "../../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { Provider } from "react-redux";
import { searchOfficersSuccess } from "../../../actionCreators/officersActionCreators";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../../../cases/thunks/getCaseDetails", () => caseId => ({
  type: "MOCK_ACTION",
  caseId
}));

describe("OfficerSearchResults", () => {
  describe("spinner", () => {
    test("should display spinner when spinnerVisible is true", () => {
      const wrapper = shallow(
        <OfficerSearchResults
          currentCase={{ id: 1 }}
          caseId={1}
          spinnerVisible={true}
          searchResults={[]}
        />
      );
      const spinner = wrapper.find("[data-test='spinner']");
      expect(spinner.exists()).toEqual(true);
    });
    test("should not display spinner when spinnerVisible is false", () => {
      const wrapper = shallow(
        <OfficerSearchResults
          currentCase={{ id: 1 }}
          spinnerVisible={false}
          searchResults={[]}
          caseId={1}
        />
      );
      const spinner = wrapper.find("[data-test='spinner']");
      expect(spinner.exists()).toEqual(false);
    });
  });
  describe("search results message", () => {
    test("should not display search results message when searchResults are empty and spinner is not visible", () => {
      const wrapper = shallow(
        <OfficerSearchResults
          currentCase={{ id: 1 }}
          spinnerVisible={false}
          searchResults={[]}
          caseId={1}
        />
      );
      const searchResultsMessage = wrapper.find(
        "[data-test='searchResultsMessage']"
      );
      expect(searchResultsMessage.exists()).toEqual(true);
    });
    test("should not display search results message when searchResults are empty and spinner is visible", () => {
      const wrapper = shallow(
        <OfficerSearchResults
          currentCase={{ id: 1 }}
          spinnerVisible={true}
          searchResults={[]}
          caseId={1}
        />
      );
      const searchResultsMessage = wrapper.find(
        "[data-test='searchResultsMessage']"
      );
      expect(searchResultsMessage.exists()).toEqual(false);
    });

    test("should initialize OfficerDetails form when select is clicked", () => {
      const store = createConfiguredStore();
      const anAccusedOfficer = {
        id: 34,
        notes: "bad person",
        roleOnCase: "Accused",
        officerId: 23
      };
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          accusedOfficers: [anAccusedOfficer],
          complainantWitnessOfficers: []
        })
      );

      store.dispatch(searchOfficersSuccess([{ firstName: "bob", id: 1 }]));
      const dispatchSpy = jest.spyOn(store, "dispatch");

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <ConnectedOfficerSearchResults
              caseId={1}
              caseOfficerId={"34"}
              spinnerVisible={false}
              classes={{}}
              path={"/some/path"}
              initialize={{ type: "MOCK_TYPE" }}
            />
          </Router>
        </Provider>
      );

      const selectNewOfficerButton = wrapper
        .find('[data-test="selectNewOfficerButton"]')
        .first();
      selectNewOfficerButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith({ type: "MOCK_TYPE" });
    });

    test("should display number of search results when single result is present and spinner is not visible", () => {
      const wrapper = shallow(
        <OfficerSearchResults
          currentCase={{ id: 1 }}
          caseId={1}
          spinnerVisible={false}
          classes={{}}
          searchResults={[{ firstName: "bob", id: 1 }]}
          officerIds={[4]}
        />
      );
      expect(
        wrapper
          .find("[data-test='searchResultsMessage']")
          .children()
          .text()
      ).toEqual("1 result found");
    });
    test("should display number of search results when searchResults are present and spinner is not visible", () => {
      const wrapper = shallow(
        <OfficerSearchResults
          currentCase={{ id: 1 }}
          caseId={1}
          spinnerVisible={false}
          classes={{}}
          searchResults={[
            { firstName: "bob", id: 1 },
            { firstName: "joan", id: 2 }
          ]}
          officerIds={[4]}
        />
      );
      expect(
        wrapper
          .find("[data-test='searchResultsMessage']")
          .children()
          .text()
      ).toEqual("2 results found");
    });
  });
});
