import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import ComplaintTotals from "./ComplaintTotals";
import axios from "axios";
import { waitFor } from "@testing-library/dom";
import { QUERY_TYPES } from "../../../sharedUtilities/constants";
import createConfiguredStore from "../../createConfiguredStore";
import moment from "moment";
import "@testing-library/jest-dom";
import MutationObserver from "@sheerun/mutationobserver-shim";
window.MutationObserver = MutationObserver;

jest.mock("axios");

describe("ComplaintTotals", () => {
  const store = createConfiguredStore();
  let wrapper;

  let responseBody = {
    data: { ytd: 2, previousYear: 3 }
  };

  const renderComplaintTotals = () => {
    wrapper = render(
      <Provider store={store}>
        <Router>
          <ComplaintTotals />
        </Router>
      </Provider>
    );
    return wrapper;
  };

  test("should not render complaint total counts for year to date and previous year when error on retrieving public data", async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error("errorMessage"))
    );

    const { queryByText } = renderComplaintTotals();

    await waitFor(() => {
      expect(queryByText("Complaints YTD:")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        queryByText(`Complaints ${moment().subtract(1, "y").format("YYYY")}:`)
      ).toBeInTheDocument();
    });
  });

  test("should make axios get request to get public data endpoint", async () => {
    renderComplaintTotals();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `/api/data?queryType=${QUERY_TYPES.COUNT_COMPLAINT_TOTALS}`
      );
    });
  });

  test("should render complaint total counts for year to date and previous year", async () => {
    axios.get.mockReturnValue({ ...responseBody });
    const { queryByText } = renderComplaintTotals();

    await waitFor(() => {
      expect(queryByText("Complaints YTD: 2")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        queryByText(`Complaints ${moment().subtract(1, "y").format("YYYY")}: 3`)
      ).toBeInTheDocument();
    });
  });
});
