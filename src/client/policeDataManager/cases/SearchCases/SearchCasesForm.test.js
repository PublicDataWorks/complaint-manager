import React from "react";
import { push } from "connected-react-router";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent, render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import SearchCasesForm from "./SearchCasesForm";
import createConfiguredStore from "../../../createConfiguredStore";

describe("SearchCasesForm", () => {
  let store, dispatchSpy, searchCasesFormWrapper;
  let searchQuery = "app";

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
    test("should redirect to results page with query string", async () => {
      const { getByTestId } = searchCasesFormWrapper;
      const textField = getByTestId("searchField");
      const submitButton = getByTestId("searchButton");
      fireEvent.change(textField, { target: { value: searchQuery } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Assert
        expect(dispatchSpy).toHaveBeenCalledWith(
          push(`/search?queryString=${searchQuery}`)
        );
      });
    });
  });
});
