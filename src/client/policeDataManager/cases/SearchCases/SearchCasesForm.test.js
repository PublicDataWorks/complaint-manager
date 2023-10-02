import React from "react";
import "@testing-library/jest-dom";
import { push } from "connected-react-router";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";
import SearchCasesForm, { mapStateToProps } from "./SearchCasesForm";
import createConfiguredStore from "../../../createConfiguredStore";

describe("SearchCasesForm.mapStateToProps", () => {
  const queryString = "hello";
  test("should map queryString from URL with defined queryString", async () => {
    expect(
      mapStateToProps({
        router: { location: { search: `?queryString=${queryString}` } }
      })
    ).toEqual({ initialValues: { queryString } });
  });

  test("should map no queryString from URL with no queryString", async () => {
    expect(mapStateToProps({ router: { location: {} } })).toEqual({
      initialValues: {}
    });
  });

  test("should map no queryString from URL with no queryString", async () => {
    expect(
      mapStateToProps({
        router: {
          location: {
            search: "?queryString=hello%20there"
          }
        }
      })
    ).toEqual({ initialValues: { queryString: "hello there" } });
  });
});

describe("SearchCasesForm", () => {
  let store, dispatchSpy, searchCasesFormWrapper;
  let searchQuery = "   an apple    ";
  let correctSearchQuery = "an apple";

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    searchCasesFormWrapper = render(
      <Provider store={store}>
        <Router>
          <SearchCasesForm />
        </Router>
      </Provider>
    );
  });

  describe("tooltip", () => {
    test("should display tooltip button", () => {
      expect(screen.getByTestId("search-tooltip-button")).toBeInTheDocument();
    });

    test("should display tooltip if tooltip button is clicked and hide it if clicked again", () => {
      userEvent.click(screen.getByTestId("search-tooltip-button"));
      expect(screen.getByTestId("search-tooltip")).toBeInTheDocument();

      userEvent.click(screen.getByTestId("search-tooltip-button"));
      expect(screen.queryByTestId("search-tooltip")).toBeFalsy();
    });
  });

  describe("onSubmit", () => {
    let getByTestId, textField, submitButton;
    beforeEach(() => {
      getByTestId = searchCasesFormWrapper.getByTestId;
      textField = getByTestId("searchField");
      submitButton = getByTestId("searchButton");
    });

    test("should redirect to results page with query string", async () => {
      fireEvent.change(textField, { target: { value: searchQuery } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Assert
        expect(dispatchSpy).toHaveBeenCalledWith(
          push(`/search?queryString=${correctSearchQuery}`)
        );
      });
    });

    test("should not redirect if the query string is blank", async () => {
      fireEvent.change(textField, { target: { value: "   " } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Assert
        expect(dispatchSpy).not.toHaveBeenCalledWith({
          payload: {
            args: expect.anything(),
            method: "push"
          },
          type: expect.anything()
        });
      });
    });

    test("should display query string after unmounting and remounting component", async () => {
      fireEvent.change(textField, { target: { value: searchQuery } });
      fireEvent.click(submitButton);
      searchCasesFormWrapper.unmount();
      searchCasesFormWrapper = render(
        <Provider store={store}>
          <Router>
            <SearchCasesForm />
          </Router>
        </Provider>
      );

      expect(screen.queryByTestId("searchField").value).toEqual(searchQuery);
    });
  });
});
