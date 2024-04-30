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

  test("should display Complaints by Intake Source YTD Visualization", async () => {
    dataDashboardWrapper.update();
    expect(
      dataDashboardWrapper.find('[data-testid="intakeSourceGraphYTD"]').exists()
    ).toBeTrue();
  });

  test("should display Complaints by Intake Source Past 12 Months Visualization", async () => {
    dataDashboardWrapper.update();
    expect(
      dataDashboardWrapper
        .find('[data-testid="intakeSourceGraphPast12"]')
        .exists()
    ).toBeTrue();
  });

  test("should display Complaints by Complainant Type YTD Visualization", async () => {
    dataDashboardWrapper.update();
    expect(
      dataDashboardWrapper
        .find('[data-testid="complainantTypeGraphYTD"]')
        .exists()
    ).toBeTrue();
  });

  test("should display Complaints by Complainant Type Past 12 Months Visualization", async () => {
    dataDashboardWrapper.update();
    expect(
      dataDashboardWrapper
        .find('[data-testid="complainantTypeGraphPast12"]')
        .exists()
    ).toBeTrue();
  });

  test("should display Top 10 Tags Visualization", async () => {
    dataDashboardWrapper.update();
    expect(
      dataDashboardWrapper.find('[data-testid="top10TagsGraph"]').exists()
    ).toBeTrue();
  });
  test("should display case status filter checkboxes", async () => {
    dataDashboardWrapper.update();
    expect(
      dataDashboardWrapper.find('[data-testid="checkbox"]').exists()
    ).toBeTrue();
  })
});
