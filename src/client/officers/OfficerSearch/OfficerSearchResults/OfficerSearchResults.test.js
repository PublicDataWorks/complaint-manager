import React from "react";
import { shallow } from "enzyme";
import { OfficerSearchResults } from "./OfficerSearchResults";
import getCaseDetails from "../../../cases/thunks/getCaseDetails";

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

    test("should fetch case details when different case is loaded", () => {
      const mockDispatch = jest.fn();
      const caseId = 2;
      const wrapper = shallow(
        <OfficerSearchResults
          currentCase={{ id: 1 }}
          caseId={caseId}
          spinnerVisible={false}
          classes={{}}
          searchResults={[{ firstName: "bob", id: 1 }]}
          officerIds={[4]}
          dispatch={mockDispatch}
        />
      );

      expect(mockDispatch).toHaveBeenCalledWith(getCaseDetails(caseId));
    });

    test("should fetch case details when no case is loaded", () => {
      const mockDispatch = jest.fn();
      const caseId = 2;
      const wrapper = shallow(
        <OfficerSearchResults
          currentCase={null}
          caseId={caseId}
          spinnerVisible={false}
          classes={{}}
          searchResults={[{ firstName: "bob", id: 1 }]}
          officerIds={[4]}
          dispatch={mockDispatch}
        />
      );

      expect(mockDispatch).toHaveBeenCalledWith(getCaseDetails(caseId));
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
