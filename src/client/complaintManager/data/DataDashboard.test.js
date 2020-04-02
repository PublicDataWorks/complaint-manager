import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../createConfiguredStore";
import DataDashboard from "./DataDashboard";
import "@testing-library/jest-dom";
import { mount } from "enzyme";
import NavBar from "../shared/components/NavBar/NavBar";

jest.mock("../../common/components/Visualization/PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});

describe("DataDashboard", () => {
  let dataDashboardWrapper, store;

  beforeEach(() => {
    store = createConfiguredStore();

    dataDashboardWrapper = mount(
      <Provider store={store}>
        <Router>
          <DataDashboard />
        </Router>
      </Provider>
    );
  });

  test("should display navbar with title", async () => {
    const navBar = dataDashboardWrapper.find(NavBar);
    expect(navBar.contains("Data Dashboard")).toEqual(true);
  });

  test("should display Complaints by Intake Source Visualization", async () => {
    dataDashboardWrapper.update();
    expect(
      dataDashboardWrapper.find('[data-testid="dataVisualization"]').exists()
    ).toBeTrue();
  });
});
