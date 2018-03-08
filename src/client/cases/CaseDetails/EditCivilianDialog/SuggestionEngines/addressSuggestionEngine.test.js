import AddressSuggestionEngine from "./addressSuggestionEngine";

describe('AddressSuggestionEngine', () => {
    test('should filter out google suggestions that lack a street number', () => {
        const streetAddress = {
            "description": "2001 North Milwaukee Avenue, Chicago, IL, USA",
            "types": [
                "street_address",
                "geocode"
            ]
        };
        const nonStreetAddress = {
            "description": "South Canal Street, Chicago, IL, USA",
            "types": [
                "route",
                "geocode"
            ]
        };
        const mockedGoogle = {
            maps: {
                places: {
                    AutocompleteService: jest.fn(() => ({
                        getPlacePredictions: (input, callback) => {
                            const cannedSuggestions = [
                                streetAddress, nonStreetAddress
                            ]
                            callback(cannedSuggestions)
                        }
                    })),
                    PlacesService: jest.fn()
                }
            }
        }

        const addressSuggestionEngine = new AddressSuggestionEngine(mockedGoogle)
        const callback = (filteredAddresses) => {
            expect(filteredAddresses).toMatchObject([streetAddress])
        }

        addressSuggestionEngine.onFetchSuggestions("", callback)
    })

    test('should not filter results when no results', () => {
        const mockedGoogle = {
            maps: {
                places: {
                    AutocompleteService: jest.fn(() => ({
                        getPlacePredictions: (input, callback) => {
                            callback(null)
                        }
                    })),
                    PlacesService: jest.fn()
                }
            }
        }

        const addressSuggestionEngine = new AddressSuggestionEngine(mockedGoogle)
        const callback = (filteredAddresses) => {
            expect(filteredAddresses).toMatchObject([])
        }

        addressSuggestionEngine.onFetchSuggestions("", callback)
    })
});

