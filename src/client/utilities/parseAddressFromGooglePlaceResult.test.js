import parseAddressFromGooglePlaceResult from "./parseAddressFromGooglePlaceResult";

describe('parseAddressFromGooglePlaceResult', () => {
    test('should parse a full street address', () => {
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
                }],
            name: '2714 Canal Street'
        }
        const parsedAddress = parseAddressFromGooglePlaceResult(somePlace)

        expect(parsedAddress.streetAddress).toEqual('2714 Canal St')
        expect(parsedAddress.city).toEqual('New Orleans')
        expect(parsedAddress.state).toEqual('LA')
        expect(parsedAddress.zipCode).toEqual('70119')
        expect(parsedAddress.country).toEqual('US')
    })

    test('should ignore street number if missing', () => {
        const somePlace = {
            "address_components": [
                {
                    "long_name": "Canal Street",
                    "short_name": "Canal St",
                    "types": ["route"]
                }, {
                    "long_name": "New Orleans",
                    "short_name": "New Orleans",
                    "types": ["locality", "political"]
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
                }],
            name: 'Canal Street'
        }
        const parsedAddress = parseAddressFromGooglePlaceResult(somePlace)

        expect(parsedAddress.streetAddress).toEqual('Canal St')
    })

    test('should ignore street if missing', () => {
        const somePlace = {
            "address_components": [
                {
                    "long_name": "New Orleans",
                    "short_name": "New Orleans",
                    "types": ["locality", "political"]
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
                }],
            name: 'New Orleans'
        }
        const parsedAddress = parseAddressFromGooglePlaceResult(somePlace)

        expect(parsedAddress.streetAddress).toEqual('')
    })

    test('should ignore city if missing', () => {
        const somePlace = {
            "address_components": [
                {
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
                }],
            name: 'Louisiana'
        }
        const parsedAddress = parseAddressFromGooglePlaceResult(somePlace)

        expect(parsedAddress.city).toEqual('')
    })

    test('should ignore state if missing', () => {
        const somePlace = {
            "address_components": [
                {
                    "long_name": "Mid-City",
                    "short_name": "Mid-City",
                    "types": ["neighborhood", "political"]
                }, {
                    "long_name": "Orleans Parish",
                    "short_name": "Orleans Parish",
                    "types": ["administrative_area_level_2", "political"]
                }, {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }, {
                    "long_name": "70119",
                    "short_name": "70119",
                    "types": ["postal_code"]
                }],
            name: 'Mid-City'
        }
        const parsedAddress = parseAddressFromGooglePlaceResult(somePlace)

        expect(parsedAddress.state).toEqual('')
    })

    test('should ignore zipCode if missing', () => {
        const somePlace = {
            "address_components": [
                {
                    "long_name": "Mid-City",
                    "short_name": "Mid-City",
                    "types": ["neighborhood", "political"]
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
                }],
            name: 'Mid-City'
        }
        const parsedAddress = parseAddressFromGooglePlaceResult(somePlace)

        expect(parsedAddress.zipCode).toEqual('')
    })

    test('should ignore country if missing', () => {
        const somePlace = {
            "address_components": [
                {
                    "long_name": "Mid-City",
                    "short_name": "Mid-City",
                    "types": ["neighborhood", "political"]
                }, {
                    "long_name": "Orleans Parish",
                    "short_name": "Orleans Parish",
                    "types": ["administrative_area_level_2", "political"]
                }, {
                    "long_name": "Louisiana",
                    "short_name": "LA",
                    "types": ["administrative_area_level_1", "political"]
                }, {
                    "long_name": "70119",
                    "short_name": "70119",
                    "types": ["postal_code"]
                }],
            name: 'Mid-City'
        }
        const parsedAddress = parseAddressFromGooglePlaceResult(somePlace)

        expect(parsedAddress.country).toEqual('')
    })

    test('should parse an intersection from an address', () => {
        const somePlace = {
            "address_components": [
                {
                    "long_name": "New Orleans",
                    "short_name": "New Orleans",
                    "types": ["locality", "political"]
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
                }],
            name: 'Bourbon Street & Canal Street'
        }

        const parsedAddress = parseAddressFromGooglePlaceResult(somePlace)

        expect(parsedAddress.intersection).toEqual('Bourbon Street & Canal Street')

    })
});
