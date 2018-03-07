import parseAddressFromGooglePlaceResult from "./parseAddressFromGooglePlaceResult";


describe('parseAddressFromGooglePlaceResult', () => {
    test('should parse street number', () => {
        const somePlace = {
            "address_components": [
                {
                    "long_name": "1",
                    "short_name": "1",
                    "types": ["floor"]
                },
                {
                    "long_name": "123",
                    "short_name": "123",
                    "types": ["street_number"]
                }
            ]
        }
        const parsedAddress = parseAddressFromGooglePlaceResult(somePlace)

        expect(parsedAddress.streetNumber).toEqual('123')
    })
});
