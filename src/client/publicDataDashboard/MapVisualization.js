import React, { useEffect, useState } from "react";
import { getVisualizationData } from "../common/components/Visualization/getVisualizationData";
import { PlotlyWrapper } from "../common/components/Visualization/PlotlyWrapper";
import districts from "../common/components/Visualization/layers/NOPD_Police_Districts.json";
import { QUERY_TYPES } from "../../sharedUtilities/constants";
import moment from "moment";

const NOLA_CENTER = { lat: 29.947, lon: -90.07 };
const DEFAULT_ZOOM = 10;

const MapVisualization = props => {
  const [location, setLocation] = useState({ lat: [], lon: [], z: [] });

  useEffect(async () => {
    setLocation(
      await getVisualizationData({
        queryType: QUERY_TYPES.LOCATION_DATA,
        isPublic: true,
        queryOptions: {
          minDate: moment().subtract(12, "months").format("YYYY-MM-DD")
        }
      })
    );
  }, []);

  return (
    <PlotlyWrapper
      data={[
        {
          type: "densitymapbox",
          lat: location.lat,
          lon: location.lon,
          radius: 50,
          z: location.z,
          hoverinfo: "skip",
          coloraxis: "coloraxis"
        }
      ]}
      layout={{
        dragmode: "zoom",
        mapbox: {
          style: "open-street-map",
          center: NOLA_CENTER,
          zoom: DEFAULT_ZOOM,
          opacity: 0.9,
          autocolorscale: false,
          layers: [
            // {
            //   sourcetype: "geojson",
            //   source: districts,
            //   type: "line"
            // }
            // {
            //   sourcetype: "geojson",
            //   source: district1,
            //   type: "fill",
            //   color: "rgba(0, 255, 0, 0.5)"
            // },
            // {
            //   sourcetype: "geojson",
            //   source: district2,
            //   type: "fill",
            //   color: "rgba(255, 0, 0, 0.5)"
            // },
            // {
            //   sourcetype: "geojson",
            //   source: district3,
            //   type: "fill",
            //   color: "rgba(0, 0, 0, 0.5)"
            // },
            // {
            //   sourcetype: "geojson",
            //   source: district4,
            //   type: "fill",
            //   color: "rgba(255, 255, 255, 0.5)"
            // },
            // {
            //   sourcetype: "geojson",
            //   source: district5,
            //   type: "fill",
            //   color: "rgba(0, 0, 255, 0.5)"
            // },
            // {
            //   sourcetype: "geojson",
            //   source: district6,
            //   type: "fill",
            //   color: "rgba(255, 0, 255, 0.5)"
            // },
            // {
            //   sourcetype: "geojson",
            //   source: district7,
            //   type: "fill",
            //   color: "rgba(0, 255, 255, 0.5)"
            // },
            // {
            //   sourcetype: "geojson",
            //   source: district8,
            //   type: "fill",
            //   color: "rgba(255, 255, 0, 0.5)"
            // }
            // {
            //     sourcetype: "geojson",
            //     source: headquarters,
            //     type: "symbol",
            //     layout: {
            //         "text-field": ["get", "description"],
            //         "text-variable-anchor": ["top", "bottom", "left", "right"],
            //         "text-radial-offset": 0.5,
            //         "text-justify": "auto",
            //         "icon-image": "village"
            //     }
            // }
          ]
        },
        margin: { r: 0, t: 0, b: 0, l: 0 }
      }}
    />
  );
};

export default MapVisualization;
