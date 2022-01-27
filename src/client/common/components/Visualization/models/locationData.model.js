import Visualization from "./visualization.model";
import { QUERY_TYPES } from "../../../../../sharedUtilities/constants";

export default class LocationData extends Visualization {
  get queryType() {
    return QUERY_TYPES.LOCATION_DATA;
  }

  transformData(rawData) {
    return {
      lat: rawData.map(coord => coord.lat),
      lon: rawData.map(coord => coord.lon),
      z: Array(rawData.length).fill(0.1)
    };
  }
}
