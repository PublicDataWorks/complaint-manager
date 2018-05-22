import React from "react";
import { shallow } from "enzyme/build/index";
import SearchResults from "./SearchResults";

describe("SearchResults", () => {
  test("should display spinner when spinnerVisible is true", () => {
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={true}
        searchResults={[]}
        searchResultsIds={[]}
        render={jest.fn()}
      />
    );
    const spinner = wrapper.find("[data-test='spinner']");
    expect(spinner.exists()).toEqual(true);
  });

  test("should not display spinner when spinnerVisible is false", () => {
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={false}
        searchResults={[]}
        searchResultsIds={[]}
        render={jest.fn()}
      />
    );
    const spinner = wrapper.find("[data-test='spinner']");
    expect(spinner.exists()).toEqual(false);
  });

  test("should not display search results message when searchResults are empty and spinner is not visible", () => {
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={false}
        searchResults={[]}
        searchResultsIds={[]}
        render={jest.fn()}
      />
    );
    const searchResultsMessage = wrapper.find(
      "[data-test='searchResultsMessage']"
    );
    expect(searchResultsMessage.exists()).toEqual(true);
  });

  test("should display number of search results when single result is present and spinner is not visible", () => {
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={false}
        searchResults={[{ firstName: "bob", id: 1 }]}
        searchResultsIds={[4]}
        render={jest.fn()}
      />
    );
    expect(
      wrapper
        .find("[data-test='searchResultsMessage']")
        .children()
        .text()
    ).toEqual("1 result found");
  });

  test("should not display search results message when searchResults are empty and spinner is visible", () => {
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={true}
        searchResults={[]}
        searchResultsIds={[]}
        render={jest.fn()}
      />
    );
    const searchResultsMessage = wrapper.find(
      "[data-test='searchResultsMessage']"
    );
    expect(searchResultsMessage.exists()).toEqual(false);
  });

  test("should display number of search results when searchResults are present and spinner is not visible", () => {
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={false}
        searchResults={[
          { firstName: "bob", id: 1 },
          { firstName: "joan", id: 2 }
        ]}
        searchResultsIds={[1, 2]}
        render={jest.fn()}
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
