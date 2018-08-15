import parseAddressFromGooglePlaceResult from "../../../../utilities/parseAddressFromGooglePlaceResult";

class MapService {
  constructor() {
    this.google = window.google;
    this.autoCompleteService = new window.google.maps.places.AutocompleteService();
    this.geocoderService = new window.google.maps.Geocoder();
  }

  healthCheck(callback) {
    let googleAddressServiceIsAvailable = true,
      geocoderServiceIsAvailable = true;

    this.autoCompleteService.getPlacePredictions(
      {
        input: "test"
      },
      (addresses, status) => {
        googleAddressServiceIsAvailable = !(
          status === this.google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR
        );
      }
    );

    this.geocoderService.geocode(
      {
        placeId: "test"
      },
      (results, status) => {
        geocoderServiceIsAvailable = !(
          status === window.google.maps.GeocoderStatus.UNKNOWN_ERROR
        );
      }
    );

    callback({ googleAddressServiceIsAvailable, geocoderServiceIsAvailable });
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
