import React, { useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { getVisualizationData } from "./getVisualizationData";
import { PlotlyWrapper } from "./PlotlyWrapper";
import districts from "./layers/NOPD_Police_Districts.json";
import { QUERY_TYPES } from "../../../../sharedUtilities/constants";
import moment from "moment";

const NOLA_CENTER = { lat: 29.947, lon: -90.07 };
const DEFAULT_ZOOM = 10;
const DISTRICT_DATA = {
  type: "choroplethmapbox",
  geojson: districts,
  locationmode: "geojson-id",
  featureidkey: "id",
  locations: [
    "District1",
    "District2",
    "District3",
    "District4",
    "District5",
    "District6",
    "District7",
    "District8"
  ],
  text: [
    "Police District 1",
    "Police District 2",
    "Police District 3",
    "Police District 4",
    "Police District 5",
    "Police District 6",
    "Police District 7",
    "Police District 8"
  ],
  hoverinfo: "text",
  showlegend: false,
  showscale: false,
  autocolorscale: false,
  colorscale: "Jet",
  z: [1, 2, 3, 4, 5, 6, 7, 8],
  zmin: 1,
  zmax: 8,
  marker: {
    opacity: 0.3
  }
};
const DISTRICT_OUTLINE = {
  sourcetype: "geojson",
  source: districts,
  type: "line"
};

const MapVisualization = props => {
  const [location, setLocation] = useState({ lat: [], lon: [], z: [] });
  const [showDistrict, setShowDistrict] = useState(false);

  useEffect(() => {
    const load = async () =>
      setLocation(
        await getVisualizationData({
          queryType: QUERY_TYPES.LOCATION_DATA,
          isPublic: props.isPublic,
          queryOptions: {
            minDate: moment().subtract(12, "months").format("YYYY-MM-DD")
          }
        })
      );

    load();
  }, []);
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

  if (showDistrict) {
    data.push(DISTRICT_DATA);
    layers.push(DISTRICT_OUTLINE);
  }

  return (
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
            center: NOLA_CENTER,
            zoom: DEFAULT_ZOOM,
            opacity: 0.9,
            autocolorscale: false,
            layers: layers
          },
          margin: { r: 0, t: 0, b: 0, l: 0 }
        }}
      />
      <section>
        <h3>Map Layers</h3>
        <FormControlLabel
          control={
            <Checkbox
              checked={showDistrict}
              onChange={event => setShowDistrict(event.target.checked)}
              color="default"
            />
          }
          label="NOPD Districts"
        />
      </section>
    </section>
  );
};

export default MapVisualization;
