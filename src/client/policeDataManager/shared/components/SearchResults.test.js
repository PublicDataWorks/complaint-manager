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
        renderRow={jest.fn()}
      />
    );
    const spinner = wrapper.find("[data-testid='spinner']");
    expect(spinner.exists()).toEqual(true);
  });

  test("should not display spinner when spinnerVisible is false", () => {
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={false}
        searchResults={[]}
        searchResultsIds={[]}
        renderRow={jest.fn()}
      />
    );
    const spinner = wrapper.find("[data-testid='spinner']");
    expect(spinner.exists()).toEqual(false);
  });

  test("should not display search results message when searchResults are empty and spinner is not visible", () => {
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={false}
        searchResults={[]}
        searchResultsIds={[]}
        renderRow={jest.fn()}
      />
    );
    const searchResultsMessage = wrapper.find(
      "[data-testid='searchResultsMessage']"
    );
    expect(searchResultsMessage.exists()).toEqual(true);
  });

  test("should display number of search results when single result is present and spinner is not visible", () => {
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={false}
        searchResults={[{ firstName: "bob", id: 1 }]}
        searchResultsIds={[4]}
        renderRow={jest.fn()}
      />
    );
    expect(
      wrapper.find("[data-testid='searchResultsMessage']").children().text()
    ).toEqual("1 result found");
  });

  test("should not display search results message when searchResults are empty and spinner is visible", () => {
    const wrapper = shallow(
      <SearchResults
        spinnerVisible={true}
        searchResults={[]}
        searchResultsIds={[]}
        renderRow={jest.fn()}
      />
    );
    const searchResultsMessage = wrapper.find(
      "[data-testid='searchResultsMessage']"
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
        renderRow={jest.fn()}
      />
    );
    expect(
      wrapper.find("[data-testid='searchResultsMessage']").children().text()
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
        renderRow={jest.fn()}
        subtitleResultCount={false}
      />
    );
    const containsText = wrapper
      .find("[data-testid='searchResultsMessage'] p")
      .first();

    return expect(containsText.text()).toBeFalsy();
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
        renderRow={jest.fn()}
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
        renderRow={jest.fn()}
      />
    );
    expect(wrapper.find(Pagination).exists()).toBeTruthy();
  });
});
