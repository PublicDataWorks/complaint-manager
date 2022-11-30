import React from "react";
import { shallow } from "enzyme";
import MapVisualization from "./MapVisualization";
import { PlotlyWrapper } from "./PlotlyWrapper";
import { rest } from "msw";
import { QUERY_TYPES } from "../../../../sharedUtilities/constants";

const {
  MAP_CONFIG
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const MOCK_DATA = { lat: [], lon: [], z: [] };

rest.get(
  `/api/public-data?queryType=${QUERY_TYPES.LOCATION_DATA}`,
  (req, res, ctx) => res(ctx.json(MOCK_DATA))
);

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

  const description = "should render heatmap all the time";

  if (MAP_CONFIG) {
    // if MAP_CONFIG is undefined the map won't work... at all
    test(description, () => {
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
  } else {
    test.skip(description, () => {});
  }
});
