// Import this named export into your test file:
export const healthCheck = jest.fn(callback => {
  callback({ googleAddressServiceIsAvailable: true });
});

export const getSuggestionValue = jest.fn(suggestion => {
  return suggestion.description;
});

export const fetchSuggestions = jest.fn((input, callback) => {
  callback([{ description: "200 East Randolph Street, Chicago, IL, US" }]);
});

export const suggestionSelected = jest.fn(
  (suggestion, successCallback, failureCallback) => {
    successCallback({
      additionalLocationInfo: null,
      addressableId: 821,
      addressableType: "civilian",
      addressable_type: "civilian",
      city: "Chicago",
      country: "US",
      createdAt: "2019-05-20T21:04:01.214Z",
      deletedAt: null,
      id: 1049,
      intersection: "",
      lat: 41.8855572,
      lng: -87.6214826,
      placeId: "ChIJObywJqYsDogR_4XaBVM4ge8",
      state: "IL",
      streetAddress: "200 E Randolph St",
      updatedAt: "2019-05-21T16:26:20.040Z",
      zipCode: "60601"
    });
  }
);

export const fetchAddressDetails = jest.fn(
  (addressIdentifier, successCallback, failureCallback) => {
    successCallback({
      additionalLocationInfo: null,
      addressableId: 821,
      addressableType: "civilian",
      addressable_type: "civilian",
      city: "Chicago",
      country: "US",
      createdAt: "2019-05-20T21:04:01.214Z",
      deletedAt: null,
      id: 1049,
      intersection: "",
      lat: 41.8855572,
      lng: -87.6214826,
      placeId: "ChIJObywJqYsDogR_4XaBVM4ge8",
      state: "IL",
      streetAddress: "200 E Randolph St",
      updatedAt: "2019-05-21T16:26:20.040Z",
      zipCode: "60601"
    });
  }
);

const mock = jest.fn().mockImplementation(() => {
  return {
    healthCheck: healthCheck,
    getSuggestionValue: getSuggestionValue,
    fetchAddressDetails: fetchAddressDetails,
    fetchSuggestions: fetchSuggestions,
    suggestionSelected: suggestionSelected
  };
});
export default mock;
