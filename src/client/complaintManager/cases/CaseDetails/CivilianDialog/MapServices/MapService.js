import parseAddressFromGooglePlaceResult from "../../../../utilities/parseAddressFromGooglePlaceResult";
import { add } from "winston";

class MapService {
  constructor() {
    this.google = window.google;
    this.autoCompleteService = new window.google.maps.places.AutocompleteService();
    this.geocoderService = new window.google.maps.Geocoder();
  }

  setMapServices(autoCompleteService, geocoderService) {
    this.autoCompleteService = autoCompleteService;
    this.geocoderService = geocoderService;
  }

  healthCheck(callback) {
    this.autoCompleteService.getPlacePredictions(
      {
        input: "test"
      },
      (addresses, status) => {
        const googleAddressServiceIsAvailable =
          status === this.google.maps.places.PlacesServiceStatus.OK ||
          status === this.google.maps.places.PlacesServiceStatus.ZERO_RESULTS;
        callback({ googleAddressServiceIsAvailable });
      }
    );

    this.geocoderService.geocode(
      {
        placeId: "ChIJrTLr-GyuEmsRBfy61i59si0"
      },
      (results, status) => {
        const geocoderServiceIsAvailable =
          status === window.google.maps.GeocoderStatus.OK ||
          status === window.google.maps.GeocoderStatus.ZERO_RESULTS;
        callback({ geocoderServiceIsAvailable });
      }
    );
  }

  getSuggestionValue = suggestion => {
    return Boolean(suggestion) ? suggestion.description : "";
  };

  fetchSuggestions = (input, callback) => {
    this.autoCompleteService.getPlacePredictions(
      {
        input: input,
        types: ["geocode", "establishment"]
      },
      addresses => {
        if (!addresses) {
          callback([]);
        } else {
          callback(addresses);
        }
      }
    );
  };

  testGeocoderLimits = numCalls => {
    console.log("Testing Limits with ", numCalls);
    for (let i = 0; i < numCalls; i++) {
      console.log("In num calls");
      this.geocoderService.geocode(
        { placeId: "ChIJrTLr-GyuEmsRBfy61i59si0" },
        (results, status) => {
          console.log("Finished loading", status);
          if (status === window.google.maps.GeocoderStatus.OK) {
            console.log("success ok");
          } else {
            console.log("not ok");
          }
        }
      );
    }
  };

  fetchAddressDetails = (
    addressIdentifier,
    successCallback,
    failureCallback
  ) => {
    this.geocoderService.geocode(addressIdentifier, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        // PROOF:
        const result = results[0];
        const displayAddress = result.formatted_address;
        console.log("Result From Geocoding Selected option", result);
        console.log("Address of Selected Option is ", displayAddress);

        // this is handleValidateAddress which sends to redux form and backend address
        // does more than just give a suggestion
        successCallback(
          parseAddressFromGooglePlaceResult(results[0]),
          displayAddress
        );
      } else if (status === window.google.maps.GeocoderStatus.ZERO_RESULTS) {
        failureCallback("");
      } else {
        failureCallback(
          "Something went wrong and we could not validate the entered address."
        );
      }
    });
  };
}

export default MapService;
