import districts from "../layers/NOPD_Police_Districts.json";

export const transformData = rawData => ({
  data: [
    {
      type: "densitymapbox",
      lat: rawData.map(coord => coord.lat),
      lon: rawData.map(coord => coord.lon),
      z: Array(rawData.length).fill(0.1),
      radius: 25,
      hoverinfo: "skip",
      opacity: 0.8,
      autocolorscale: false,
      colorscale: "Cividis",
      showscale: false,
      showlegend: false
    },
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
});
