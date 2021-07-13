import parseAddressFromGooglePlaceResult from "./parseAddressFromGooglePlaceResult";

describe("parseAddressFromGooglePlaceResult", () => {
  test("should parse a full street address", () => {
    const somePlace = {
      address_components: [
        {
          long_name: "2714",
          short_name: "2714",
          types: ["street_number"]
        }, 
        {
          long_name: "Canal Street",
          short_name: "Canal St",
          types: ["route"]
        },
        {
          long_name: "Mid-City",
          short_name: "Mid-City",
          types: ["neighborhood", "political"]
        },
        {
          long_name: "New Orleans",
          short_name: "New Orleans",
          types: ["locality", "political"]
        },
        {
          long_name: "Orleans Parish",
          short_name: "Orleans Parish",
          types: ["administrative_area_level_2", "political"]
        },
        {
          long_name: "Louisiana",
          short_name: "LA",
          types: ["administrative_area_level_1", "political"]
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"]
        },
        {
          long_name: "70119",
          short_name: "70119",
          types: ["postal_code"]
        }
      ],
      name: "2714 Canal Street"
    };
    const parsedAddress = parseAddressFromGooglePlaceResult(somePlace);

    expect(parsedAddress.streetAddress).toEqual("2714 Canal St");
    expect(parsedAddress.city).toEqual("New Orleans");
    expect(parsedAddress.state).toEqual("LA");
    expect(parsedAddress.zipCode).toEqual("70119");
    expect(parsedAddress.country).toEqual("US");
  });

  test("should ignore street number if missing", () => {
    const somePlace = {
      address_components: [
        {
          long_name: "Canal Street",
          short_name: "Canal St",
          types: ["route"]
        },
        {
          long_name: "New Orleans",
          short_name: "New Orleans",
          types: ["locality", "political"]
        },
        {
          long_name: "Louisiana",
          short_name: "LA",
          types: ["administrative_area_level_1", "political"]
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"]
        },
        {
          long_name: "70119",
          short_name: "70119",
          types: ["postal_code"]
        }
      ],
      name: "Canal Street"
    };
    const parsedAddress = parseAddressFromGooglePlaceResult(somePlace);

    expect(parsedAddress.streetAddress).toEqual("Canal St");
  });

  test("should ignore street if missing", () => {
    const somePlace = {
      address_components: [
        {
          long_name: "New Orleans",
          short_name: "New Orleans",
          types: ["locality", "political"]
        },
        {
          long_name: "Louisiana",
          short_name: "LA",
          types: ["administrative_area_level_1", "political"]
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"]
        },
        {
          long_name: "70119",
          short_name: "70119",
          types: ["postal_code"]
        }
      ],
      name: "New Orleans"
    };
    const parsedAddress = parseAddressFromGooglePlaceResult(somePlace);

    expect(parsedAddress.streetAddress).toEqual("");
  });

  test("should ignore city if missing", () => {
    const somePlace = {
      address_components: [
        {
          long_name: "Louisiana",
          short_name: "LA",
          types: ["administrative_area_level_1", "political"]
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"]
        },
        {
          long_name: "70119",
          short_name: "70119",
          types: ["postal_code"]
        }
      ],
      name: "Louisiana"
    };
    const parsedAddress = parseAddressFromGooglePlaceResult(somePlace);

    expect(parsedAddress.city).toEqual("");
  });

  test("should ignore state if missing", () => {
    const somePlace = {
      address_components: [
        {
          long_name: "Mid-City",
          short_name: "Mid-City",
          types: ["neighborhood", "political"]
        },
        {
          long_name: "Orleans Parish",
          short_name: "Orleans Parish",
          types: ["administrative_area_level_2", "political"]
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"]
        },
        {
          long_name: "70119",
          short_name: "70119",
          types: ["postal_code"]
        }
      ],
      name: "Mid-City"
    };
    const parsedAddress = parseAddressFromGooglePlaceResult(somePlace);

    expect(parsedAddress.state).toEqual("");
  });

  test("should ignore zipCode if missing", () => {
    const somePlace = {
      address_components: [
        {
          long_name: "Mid-City",
          short_name: "Mid-City",
          types: ["neighborhood", "political"]
        },
        {
          long_name: "Orleans Parish",
          short_name: "Orleans Parish",
          types: ["administrative_area_level_2", "political"]
        },
        {
          long_name: "Louisiana",
          short_name: "LA",
          types: ["administrative_area_level_1", "political"]
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"]
        }
      ],
      name: "Mid-City"
    };
    const parsedAddress = parseAddressFromGooglePlaceResult(somePlace);

    expect(parsedAddress.zipCode).toEqual("");
  });

  test("should ignore country if missing", () => {
    const somePlace = {
      address_components: [
        {
          long_name: "Mid-City",
          short_name: "Mid-City",
          types: ["neighborhood", "political"]
        },
        {
          long_name: "Orleans Parish",
          short_name: "Orleans Parish",
          types: ["administrative_area_level_2", "political"]
        },
        {
          long_name: "Louisiana",
          short_name: "LA",
          types: ["administrative_area_level_1", "political"]
        },
        {
          long_name: "70119",
          short_name: "70119",
          types: ["postal_code"]
        }
      ],
      name: "Mid-City"
    };
    const parsedAddress = parseAddressFromGooglePlaceResult(somePlace);

    expect(parsedAddress.country).toEqual("");
  });

  test("parses intersection if present", () => {
    const address = {
      address_components: [
        {
          long_name: "North Desplaines Street & West Randolph Street",
          short_name: "N Desplaines St & W Randolph St",
          types: ["intersection"]
        }
      ]
    };
    const parsedAddress = parseAddressFromGooglePlaceResult(address);
    expect(parsedAddress.intersection).toEqual(
      "N Desplaines St & W Randolph St"
    );
  });

  test("should parse place id from address", () => {
    const somePlace = {
      address_components: [
        {
          long_name: "New Orleans",
          short_name: "New Orleans",
          types: ["locality", "political"]
        },
        {
          long_name: "Louisiana",
          short_name: "LA",
          types: ["administrative_area_level_1", "political"]
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"]
        },
        {
          long_name: "70119",
          short_name: "70119",
          types: ["postal_code"]
        }
      ],
      name: "Bourbon Street & Canal Street",
      place_id: "some place id"
    };

    const parsedAddress = parseAddressFromGooglePlaceResult(somePlace);

    expect(parsedAddress.placeId).toEqual("some place id");
  });

  test("should parse lat and lng from address", () => {
    const latFunction = () => {
      return 12.2;
    };
    const lngFunction = () => {
      return 14.4;
    };
    const somePlace = {
      address_components: [
        {
          long_name: "New Orleans",
          short_name: "New Orleans",
          types: ["locality", "political"]
        },
        {
          long_name: "Louisiana",
          short_name: "LA",
          types: ["administrative_area_level_1", "political"]
        },
        {
          long_name: "United States",
          short_name: "US",
          types: ["country", "political"]
        },
        {
          long_name: "70119",
          short_name: "70119",
          types: ["postal_code"]
        }
      ],
      name: "Bourbon Street & Canal Street",
      place_id: "some place id",
      geometry: {
        location: {
          lat: latFunction,
          lng: lngFunction
        }
      }
    };

    const parsedAddress = parseAddressFromGooglePlaceResult(somePlace);

    expect(parsedAddress.lat).toEqual(12.2);
    expect(parsedAddress.lng).toEqual(14.4);
  });

  test("should parse blank address", () => {
    const parsedAddress = parseAddressFromGooglePlaceResult({});

    expect(parsedAddress.streetAddress).toEqual("");
    expect(parsedAddress.intersection).toEqual("");
    expect(parsedAddress.city).toEqual("");
    expect(parsedAddress.state).toEqual("");
    expect(parsedAddress.zipCode).toEqual("");
    expect(parsedAddress.country).toEqual("");
    expect(parsedAddress.lat).toEqual(null);
    expect(parsedAddress.lng).toEqual(null);
    expect(parsedAddress.placeId).toEqual(null);
  });
});
