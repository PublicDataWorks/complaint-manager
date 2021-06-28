import React from "react";
import { push } from "connected-react-router";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import SearchCasesForm, { mapsStateToProps } from "./SearchCasesForm";
import createConfiguredStore from "../../../createConfiguredStore";


describe("SearchCasesForm.mapStateToProps", () => {
  const queryString = 'hello';
  test("should map queryString from URL with defined queryString", async () => {
    expect(
    mapsStateToProps(
      { router: { location: { search: `?queryString=${queryString}` } } }
    )
    ).toEqual({ initialValues: {queryString} });
  });

  test("should map no queryString from URL with no queryString", async () => {
    expect(
    mapsStateToProps(
      { router: { location: {}}}
    )
    ).toEqual({ initialValues: {} });
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

      console.log(screen.queryByTestId("searchField"));
      expect(screen.queryByTestId("searchField").value).toEqual(searchQuery);
    });
  });
});
