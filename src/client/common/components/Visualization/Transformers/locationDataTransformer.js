export const transformData = rawData => ({
  lat: rawData.map(coord => coord.lat),
  lon: rawData.map(coord => coord.lon),
  z: Array(rawData.length).fill(0.1)
});
