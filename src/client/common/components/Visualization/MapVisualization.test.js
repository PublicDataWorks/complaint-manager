import React from "react";
import { shallow } from "enzyme";
import MapVisualization from "./MapVisualization";
import { PlotlyWrapper } from "./PlotlyWrapper";
import { getVisualizationData } from "./getVisualizationData";
import { DATE_RANGE_TYPE } from "../../../../sharedUtilities/constants";

const MOCK_DATA = { lat: [], lon: [], z: [] };

jest.mock("./getVisualizationData", () => ({
  getVisualizationData: jest.fn(queryType => ({
    data: MOCK_DATA
  }))
}));

describe("MapVisualization", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<MapVisualization isPublic={true} />);
  });

  // For Debugging
  // test("should render", () => {
  // expect(wrapper.debug()).toEqual('Hello');
  //     expect(wrapper.find(PlotlyWrapper).prop('data')).toEqual("Hello!");
  //     expect(wrapper.find(PlotlyWrapper).prop('layout').mapbox).toEqual("Hello!");
  // });

  test("should render heatmap all the time", () => {
    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(1);
    expect(wrapper.find(PlotlyWrapper).prop("data")[0]).toEqual(
      expect.objectContaining({
        type: "densitymapbox",
        hoverinfo: "skip",
        autocolorscale: false,
        showscale: false,
        showlegend: false
      })
    );
  });
});
