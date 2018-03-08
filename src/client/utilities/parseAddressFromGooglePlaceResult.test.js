import parseAddressFromGooglePlaceResult from "./parseAddressFromGooglePlaceResult";

describe('parseAddressFromGooglePlaceResult', () => {
    test('should parse address', () => {
        const somePlace = {
            "address_components": [
                {
                    "long_name": "2714",
                    "short_name": "2714",
                    "types": ["street_number"]
                }, {
                    "long_name": "Canal Street",
                    "short_name": "Canal St",
                    "types": ["route"]
                }, {
                    "long_name": "Mid-City",
                    "short_name": "Mid-City",
                    "types": ["neighborhood", "political"]
                }, {
                    "long_name": "New Orleans",
                    "short_name": "New Orleans",
                    "types": ["locality", "political"]
                }, {
                    "long_name": "Orleans Parish",
                    "short_name": "Orleans Parish",
                    "types": ["administrative_area_level_2", "political"]
                }, {
                    "long_name": "Louisiana",
                    "short_name": "LA",
                    "types": ["administrative_area_level_1", "political"]
                }, {
                "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }, {
                    "long_name": "70119",
                    "short_name": "70119",
                    "types": ["postal_code"]
                }]
        }
        const parsedAddress = parseAddressFromGooglePlaceResult(somePlace)

        expect(parsedAddress.streetAddress).toEqual('2714 Canal St')
        expect(parsedAddress.city).toEqual('New Orleans')
        expect(parsedAddress.state).toEqual('LA')
        expect(parsedAddress.zipCode).toEqual('70119')
        expect(parsedAddress.country).toEqual('United States')
    })
});
