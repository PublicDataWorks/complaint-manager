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
    }
  ]
});
