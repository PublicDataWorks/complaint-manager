import parseAddressFromGooglePlaceResult from "../../../../utilities/parseAddressFromGooglePlaceResult";

class AddressSuggestionEngine {
  constructor() {
    this.google = window.google;
    this.autoCompleteService = new window.google.maps.places.AutocompleteService();
    this.geocoderService = new window.google.maps.Geocoder();
  }

  healthCheck(callback) {
    this.autoCompleteService.getPlacePredictions(
      {
        input: "test"
      },
      (addresses, status) => {
        if (
          status === this.google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR
        ) {
          callback({ googleAddressServiceIsAvailable: false });
        } else {
          callback({ googleAddressServiceIsAvailable: true });
        }
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
        types: ["address"]
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

  fetchAddressDetails = (
    addressIdentifier,
    successCallback,
    failureCallback
  ) => {
    this.geocoderService.geocode(addressIdentifier, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        successCallback(parseAddressFromGooglePlaceResult(results[0]));
      } else if (status === window.google.maps.GeocoderStatus.ZERO_RESULTS) {
        failureCallback("No results were found for the entered address.");
      } else {
        failureCallback(
          "Something went wrong and we could not validate the entered address."
        );
      }
    });
  };
}

export default AddressSuggestionEngine;
