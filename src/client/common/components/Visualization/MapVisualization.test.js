import React from "react";
import { shallow } from "enzyme";
import MapVisualization from "./MapVisualization";
import { PlotlyWrapper } from "./PlotlyWrapper";
import { FormControlLabel } from "@material-ui/core";

const CHECKBOX_ORDER = {
  districts: 0,
  schools: 1,
  parks: 2,
  libraries: 3
};

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

  test("should render districts when districts box is checked", () => {
    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(1);
    expect(
      wrapper.find(PlotlyWrapper).prop("layout").mapbox.layers
    ).toHaveLength(0);

    // check the districts box
    wrapper
      .find(FormControlLabel)
      .at(CHECKBOX_ORDER.districts)
      .prop("control")
      .props.onChange({ target: { checked: true } });

    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(2);
    expect(wrapper.find(PlotlyWrapper).prop("data")[1]).toEqual(
      expect.objectContaining({
        type: "choroplethmapbox",
        hoverinfo: "text",
        showlegend: false,
        showscale: false,
        autocolorscale: false
      })
    );

    expect(
      wrapper.find(PlotlyWrapper).prop("layout").mapbox.layers
    ).toHaveLength(1);
    expect(wrapper.find(PlotlyWrapper).prop("layout").mapbox.layers[0]).toEqual(
      expect.objectContaining({
        sourcetype: "geojson",
        type: "line"
      })
    );

    // uncheck the districts box
    wrapper
      .find(FormControlLabel)
      .at(CHECKBOX_ORDER.districts)
      .prop("control")
      .props.onChange({ target: { checked: false } });

    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(1);
    expect(
      wrapper.find(PlotlyWrapper).prop("layout").mapbox.layers
    ).toHaveLength(0);
  });

  test("should render schools when schools box is checked", () => {
    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(1);

    // check the districts box
    wrapper
      .find(FormControlLabel)
      .at(CHECKBOX_ORDER.schools)
      .prop("control")
      .props.onChange({ target: { checked: true } });

    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(2);
    expect(wrapper.find(PlotlyWrapper).prop("data")[1]).toEqual(
      expect.objectContaining({
        type: "scattermapbox",
        hoverinfo: "text",
        showlegend: false,
        marker: {
          color: "red"
        }
      })
    );

    // uncheck the districts box
    wrapper
      .find(FormControlLabel)
      .at(CHECKBOX_ORDER.schools)
      .prop("control")
      .props.onChange({ target: { checked: false } });

    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(1);
  });

  test("should render parks when parks box is checked", () => {
    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(1);

    // check the districts box
    wrapper
      .find(FormControlLabel)
      .at(CHECKBOX_ORDER.parks)
      .prop("control")
      .props.onChange({ target: { checked: true } });

    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(2);
    expect(wrapper.find(PlotlyWrapper).prop("data")[1]).toEqual(
      expect.objectContaining({
        type: "scattermapbox",
        hoverinfo: "text",
        showlegend: false,
        marker: {
          color: "green"
        }
      })
    );

    // uncheck the districts box
    wrapper
      .find(FormControlLabel)
      .at(CHECKBOX_ORDER.parks)
      .prop("control")
      .props.onChange({ target: { checked: false } });

    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(1);
  });

  test("should render libraries when libraries box is checked", () => {
    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(1);

    // check the districts box
    wrapper
      .find(FormControlLabel)
      .at(CHECKBOX_ORDER.libraries)
      .prop("control")
      .props.onChange({ target: { checked: true } });

    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(2);
    expect(wrapper.find(PlotlyWrapper).prop("data")[1]).toEqual(
      expect.objectContaining({
        type: "scattermapbox",
        hoverinfo: "text",
        showlegend: false,
        marker: {
          color: "#00BFFF"
        }
      })
    );

    // uncheck the districts box
    wrapper
      .find(FormControlLabel)
      .at(CHECKBOX_ORDER.libraries)
      .prop("control")
      .props.onChange({ target: { checked: false } });

    expect(wrapper.find(PlotlyWrapper).prop("data")).toHaveLength(1);
  });
});
