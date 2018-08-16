import MapService from "./MapService";
import each from "jest-each";

window.google = {
  maps: {
    places: {
      Autocomplete: class {},
      AutocompleteService: class {},
      PlacesServiceStatus: {
        OK: "ok",
        ZERO_RESULTS: "zero results",
        UNKOWN_ERROR: "unknown error"
      }
    },
    Geocoder: class {},
    GeocoderStatus: {
      OK: "ok",
      ZERO_RESULTS: "zero results",
      ERROR: "error"
    }
  }
};

describe("Map service", () => {
  each([
    [true, window.google.maps.GeocoderStatus.OK],
    [true, window.google.maps.GeocoderStatus.ZERO_RESULTS],
    [false, window.google.maps.GeocoderStatus.ERROR]
  ]).test(
    "should set map service is available props to %s when geo service respond with status is %s",
    (expectedServiceIsAvailable, statusCode) => {
      const geoCoderService = {
        geocode: (x, callback) => {
          callback({}, statusCode);
        }
      };

      const autoCompleteService = {
        getPlacePredictions: jest.fn()
      };

      const mapService = new MapService();
      mapService.setMapServices(autoCompleteService, geoCoderService);
      let propsToSet = {};

      const callBackMethod = propsToSetArgs => {
        propsToSet = propsToSetArgs;
      };

      mapService.healthCheck(callBackMethod);

      expect(propsToSet.geocoderServiceIsAvailable).toBe(
        expectedServiceIsAvailable
      );
    }
  );

  each([
    [true, window.google.maps.places.PlacesServiceStatus.OK],
    [true, window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS],
    [false, window.google.maps.places.PlacesServiceStatus.UNKOWN_ERROR]
  ]).test(
    "should set map service is available props to %s when auto complete service status is %s",
    (expectedServiceIsAvailable, statusCode) => {
      const geoCoderService = {
        geocode: jest.fn()
      };

      const autoCompleteService = {
        getPlacePredictions: (x, callback) => {
          callback({}, statusCode);
        }
      };

      const mapService = new MapService();
      mapService.setMapServices(autoCompleteService, geoCoderService);
      let propsToSet = {};

      const callBackMethod = propsToSetArgs => {
        propsToSet = propsToSetArgs;
      };

      mapService.healthCheck(callBackMethod);

      expect(propsToSet.googleAddressServiceIsAvailable).toBe(
        expectedServiceIsAvailable
      );
    }
  );
});
