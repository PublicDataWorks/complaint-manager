import React, { useEffect, useState } from "react";
import moment from "moment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { getVisualizationData } from "./getVisualizationData";
import { PlotlyWrapper } from "./PlotlyWrapper";
import districts from "./layers/NOPD_Police_Districts.json";
import schools from "./layers/Schools.json";
import parks from "./layers/parks.json";
import libraries from "./layers/Public_Libraries.json";
import { QUERY_TYPES } from "../../../../sharedUtilities/constants";

// TODO move these three consts to instance-files
const NOLA_CENTER = { lat: 29.947, lon: -90.07 };
const DEFAULT_ZOOM = 10;
const MAP_LAYERS = [
  {
    text: "NOPD Districts",
    layers: [
      {
        sourcetype: "geojson",
        source: districts,
        type: "line"
      }
    ],
    data: [
      {
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
      }
    ]
  },
  {
    text: "Schools",
    checkboxColor: "red",
    layers: [],
    data: [
      {
        type: "scattermapbox",
        lat: schools.features.map(school => school.geometry.coordinates[1]),
        lon: schools.features.map(school => school.geometry.coordinates[0]),
        text: schools.features.map(
          school => `School Name: ${school.properties.NAME}`
        ),
        hoverinfo: "text",
        showlegend: false,
        marker: {
          color: "red",
          size: 9
        }
      }
    ]
  },
  {
    text: "Parks",
    checkboxColor: "green",
    layers: [],
    data: [
      {
        type: "scattermapbox",
        lat: parks.features.map(school => school.geometry.coordinates[1]),
        lon: parks.features.map(school => school.geometry.coordinates[0]),
        text: parks.features.map(
          school => `Park Name: ${school.properties.name}`
        ),
        hoverinfo: "text",
        showlegend: false,
        marker: {
          color: "green",
          size: 9
        }
      }
    ]
  },
  {
    text: "Public Libraries",
    checkboxColor: "#00BFFF",
    layers: [],
    data: [
      {
        type: "scattermapbox",
        lat: libraries.features.map(school => school.geometry.coordinates[1]),
        lon: libraries.features.map(school => school.geometry.coordinates[0]),
        text: libraries.features.map(
          school => `Library Name: ${school.properties.FacilityName}`
        ),
        hoverinfo: "text",
        showlegend: false,
        marker: {
          color: "#00BFFF",
          size: 9
        }
      }
    ]
  }
];

const MapVisualization = props => {
  const [location, setLocation] = useState({ lat: [], lon: [], z: [] });
  const [visibleLayers, setVisibleLayers] = useState(
    MAP_LAYERS.map(() => false)
  );

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
  for (let i in MAP_LAYERS) {
    if (visibleLayers[i]) {
      data.push(...MAP_LAYERS[i].data);
      layers.push(...MAP_LAYERS[i].layers);
    }
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
        <section style={{ display: "flex", flexDirection: "column" }}>
          {MAP_LAYERS.map((layer, idx) => (
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
    </section>
  );
};

export default MapVisualization;
