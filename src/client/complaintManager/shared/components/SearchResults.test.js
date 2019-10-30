import React from "react";
import { shallow } from "enzyme/build/index";
import SearchResults from "./SearchResults";
import Pagination from "rc-pagination";
import { mount } from "enzyme";

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

  test("should not show result count in subtitle when 1 or more case(s) exists", () => {
    const wrapper = mount(
      <SearchResults
        spinnerVisible={false}
        searchResults={[
          { firstName: "bob", id: 1 },
          { firstName: "joan", id: 2 }
        ]}
        searchResultsIds={[1, 2]}
        render={jest.fn()}
        subtitleResultCount={false}
      />
    );
    const containsText = wrapper
      .find("[data-test='searchResultsMessage'] p")
      .first();

    return expect(containsText.text()).toBeFalsy();
  });

  test("should show correct no results message when passed in as parameter", () => {
    const noResultsMessage = "Test No Results Message";
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={false}
        searchResults={[]}
        render={jest.fn()}
        noResultsMessage={noResultsMessage}
      />
    );
    const resultsMessage = wrapper
      .find("[data-test='searchResultsMessage']")
      .children()
      .text();

    return expect(resultsMessage).toEqual(noResultsMessage);
  });

  test("should show default no results message when no parameter is passed.", () => {
    const defaultNoResultsMessage = "No results found";
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={false}
        searchResults={[]}
        render={jest.fn()}
      />
    );
    const resultsMessage = wrapper
      .find("[data-test='searchResultsMessage']")
      .children()
      .text();

    return expect(resultsMessage).toEqual(defaultNoResultsMessage);
  });

  test("should show correct header when supplied", () => {
    const testHeader = "Special Header";
    const wrapper = shallow(
      <SearchResults
        header={testHeader}
        spinnerVisible={false}
        searchResults={[
          { firstName: "bob", id: 1 },
          { firstName: "joanne", id: 2 }
        ]}
        searchResultsIds={[1, 2]}
        render={jest.fn()}
      />
    );

    const header = wrapper
      .find("[data-test='searchHeader']")
      .children()
      .text();

    return expect(header).toEqual(testHeader);
  });

  test("should show default header when no header is supplied", () => {
    const defaultHeader = "Search Results";
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={false}
        searchResults={[
          { firstName: "bob", id: 1 },
          { firstName: "joanne", id: 2 }
        ]}
        searchResultsIds={[1, 2]}
        render={jest.fn()}
      />
    );

    const header = wrapper
      .find("[data-test='searchHeader']")
      .children()
      .text();

    return expect(header).toEqual(defaultHeader);
  });

  test("should not find pagination component when not paginating", () => {
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
    expect(wrapper.find(Pagination).exists()).toBeFalsy();
  });

  test("should find pagination component when paginating", () => {
    const wrapper = shallow(
      <SearchResults
        pagination={{
          onChange: jest.fn(),
          totalMessage: jest.fn(),
          count: 2,
          currentPage: 1
        }}
        spinnerVisible={false}
        searchResults={[
          { firstName: "bob", id: 1 },
          { firstName: "joan", id: 2 }
        ]}
        searchResultsIds={[1, 2]}
        render={jest.fn()}
      />
    );
    expect(wrapper.find(Pagination).exists()).toBeTruthy();
  });
});
