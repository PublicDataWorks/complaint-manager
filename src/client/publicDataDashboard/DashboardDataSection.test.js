import { mount } from "enzyme";
import React from "react";
import DashboardDataSection from "./DashboardDataSection";
import {
  DATA_SECTIONS,
  DDS_COMPLAINANTS_SUBMIT_COMPLAINTS,
  DDS_COMPLAINTS_OVER_TIME,
  DDS_EMERGING_THEMES,
  DDS_WHO_SUBMITS_COMPLAINTS,
  DDS_LOCATION_DATA
} from "../../sharedUtilities/constants";
import { MuiThemeProvider } from "@material-ui/core/styles";
import dashboardStylingDesktop from "./dashboardStyling/dashboardStylingDesktop";

jest.mock(
  "../common/components/Visualization/Visualization",
  () => () => "Visualization"
);

// If you need to add new test, add a new key with a corresponding test description in the testDescriptions object below.
// Make sure you have already defined a DDS constant, for that will be your new key.
const testDescriptions = {
  [DDS_COMPLAINTS_OVER_TIME]:
    "should render correct styling for complaints over time graph",
  [DDS_COMPLAINANTS_SUBMIT_COMPLAINTS]:
    "should render correct styling for complainants submit complaints over time graph",
  [DDS_WHO_SUBMITS_COMPLAINTS]:
    "should render correct styling for who submits complaints graph",
  [DDS_EMERGING_THEMES]:
    "should render correct styling for emerging themes graph"
};

const renderDataSection = dataSectionType => () => {
  const wrapper = mount(
    <MuiThemeProvider theme={dashboardStylingDesktop}>
      <DashboardDataSection dataSectionType={dataSectionType} />
    </MuiThemeProvider>
  );

  expect(wrapper).toMatchSnapshot();
};

describe("Public Data Dashboard", () => {
  Object.keys(testDescriptions).forEach(dataSectionType => {
    test(testDescriptions[dataSectionType], renderDataSection(dataSectionType));
  });
});
