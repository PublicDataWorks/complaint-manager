import { mount } from "enzyme";
import React from "react";
import DashboardDataSection from "./DashboardDataSection";
import { MuiThemeProvider } from "@material-ui/core/styles";
import dashboardStylingDesktop from "./dashboardStyling/dashboardStylingDesktop";
import { QUERY_TYPES } from "../../sharedUtilities/constants";

const {
  DATA_SECTIONS,
  DDS_COMPLAINANTS_SUBMIT_COMPLAINTS,
  DDS_COMPLAINTS_OVER_TIME,
  DDS_EMERGING_THEMES,
  DDS_TOP_ALLEGATIONS,
  DDS_WHO_SUBMITS_COMPLAINTS
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/public-data-dashboard-options`);

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
    "should render correct styling for emerging themes graph",
  [DDS_TOP_ALLEGATIONS]:
    "should render correct styling for emerging allegation graph"
};

const renderDataSection = dataSectionType => () => {
  const wrapper = mount(
    <MuiThemeProvider theme={dashboardStylingDesktop}>
      <DashboardDataSection
        dataSectionType={{
          ...dataSectionType,
          queryType: Object.keys(QUERY_TYPES).find(
            type => QUERY_TYPES[type] === dataSectionType.queryType
          )
        }}
      />
    </MuiThemeProvider>
  );

  expect(wrapper).toMatchSnapshot();
};

describe("Dashboard Data Section", () => {
  Object.keys(testDescriptions).forEach(dataSectionType => {
    test(
      testDescriptions[dataSectionType],
      renderDataSection(DATA_SECTIONS[dataSectionType])
    );
  });
});
