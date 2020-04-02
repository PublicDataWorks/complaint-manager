import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../createConfiguredStore";
import DataDashboard from "./DataDashboard";
import { render } from "@testing-library/react";
import { wait } from "@testing-library/dom";
import "@testing-library/jest-dom";

jest.mock("../../common/components/Visualization/PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});

describe("DataDashboard", () => {
  let dataDashboardWrapper, store;

  const renderDataDashboard = () => {
    store = createConfiguredStore();

    dataDashboardWrapper = render(
      <Provider store={store}>
        <Router>
          <DataDashboard />
        </Router>
      </Provider>
    );

    return dataDashboardWrapper;
  };

  test("should display navbar with title", async () => {
    const { queryByText } = renderDataDashboard();

    await wait(() => {
      expect(queryByText("Data Dashboard")).toBeInTheDocument();
    });
  });

  test("should display Complaints by Intake Source Visualization", async () => {
    const { queryByText } = renderDataDashboard();

    await wait(() => {
      expect(queryByText("PlotlyWrapper")).toBeInTheDocument();
    });
  });
});
