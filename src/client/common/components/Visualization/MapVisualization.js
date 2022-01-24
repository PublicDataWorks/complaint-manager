import React, { useEffect, useState } from "react";
import moment from "moment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { getVisualizationData } from "./getVisualizationData";
import { PlotlyWrapper } from "./PlotlyWrapper";
import {
  DATE_RANGE_TYPE,
  QUERY_TYPES
} from "../../../../sharedUtilities/constants";
import { generateDateRange } from "./Visualization";
import VisualizationDateRangeSelect from "./VisualizationDateRangeSelect";

const {
  MAP_CONFIG
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const MapVisualization = props => {
  const [location, setLocation] = useState({ lat: [], lon: [], z: [] });
  const [visibleLayers, setVisibleLayers] = useState(
    MAP_CONFIG.LAYERS.map(() => false)
  );
  const [dateRange, setDateRange] = useState(DATE_RANGE_TYPE.PAST_12_MONTHS);

  useEffect(() => {
    const load = async () =>
      setLocation(
        await getVisualizationData({
          queryType: QUERY_TYPES.LOCATION_DATA,
          isPublic: props.isPublic,
          queryOptions: generateDateRange(dateRange)
        })
      );

    load();
  }, [dateRange]);

  let data = [
    {
      type: "densitymapbox",
      lat: location.lat,
      lon: location.lon,
      z: location.z,
      radius: 25,
      hoverinfo: "skip",
      opacity: 0.8,
      autocolorscale: false,
      colorscale: "Cividis",
      showscale: false,
      showlegend: false
    }
  ];
  let layers = [];
  for (let i in MAP_CONFIG.LAYERS) {
    if (visibleLayers[i]) {
      data.push(...MAP_CONFIG.LAYERS[i].data);
      layers.push(...MAP_CONFIG.LAYERS[i].layers);
    }
  }

  return (
    <>
      <VisualizationDateRangeSelect
        dateRange={dateRange}
        setDateRange={setDateRange}
        queryType={QUERY_TYPES.LOCATION_DATA}
      />
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          minHeight: "500px",
          width: "100%",
          gap: "15px"
        }}
      >
        <PlotlyWrapper
          style={{ flexBasis: "70%", flexGrow: 1, height: "500px" }}
          data={data}
          config={{
            responsive: true,
            useResizeHandler: true
          }}
          layout={{
            dragmode: "zoom",
            mapbox: {
              style: "open-street-map",
              center: MAP_CONFIG.CENTER,
              zoom: MAP_CONFIG.DEFAULT_ZOOM,
              opacity: 0.9,
              autocolorscale: false,
              layers: layers
            },
            margin: { r: 0, t: 0, b: 0, l: 0 }
          }}
        />{" "}
        {MAP_CONFIG.LAYERS.length ? (
          <section>
            <h3>Map Layers</h3>
            <section style={{ display: "flex", flexDirection: "column" }}>
              {MAP_CONFIG.LAYERS.map((layer, idx) => (
                <FormControlLabel
                  key={layer.text}
                  control={
                    <Checkbox
                      checked={visibleLayers[idx]}
                      onChange={event => {
                        let newVisibleLayers = [...visibleLayers];
                        newVisibleLayers[idx] = event.target.checked;
                        setVisibleLayers(newVisibleLayers);
                      }}
                      color="default"
                      style={{ color: layer.checkboxColor }}
                    />
                  }
                  label={layer.text}
                />
              ))}
            </section>
          </section>
        ) : (
          ""
        )}
      </section>
    </>
  );
};

export default MapVisualization;
