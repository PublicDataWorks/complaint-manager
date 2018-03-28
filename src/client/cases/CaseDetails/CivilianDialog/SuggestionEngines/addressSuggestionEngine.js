import parseAddressFromGooglePlaceResult from "../../../../utilities/parseAddressFromGooglePlaceResult";

class AddressSuggestionEngine {
    constructor() {
        this.google = window.google
        this.autoCompleteService = new window.google.maps.places.AutocompleteService()
        this.placeDetailsService = new window.google.maps.places.PlacesService(window.document.createElement('div'))
    }

    healthCheck(callback) {
        this.autoCompleteService.getPlacePredictions({
            input: 'test',
        }, (addresses, status) => {
            if (status === this.google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
                callback({googleAddressServiceIsAvailable: false})
            } else {
                callback({googleAddressServiceIsAvailable: true})
            }
        })
    }

    getSuggestionValue = (suggestion) => {
        return Boolean(suggestion)
            ? suggestion.description
            : ""
    }

    onFetchSuggestions = (input, callback) => {
        this.autoCompleteService.getPlacePredictions({
            input: input
        }, (addresses) => {
            if (!addresses) {
                callback([])
            } else {
                callback(addresses)
            }
        })
    }

    onSuggestionSelected = (suggestion, callback) => {
        this.placeDetailsService.getDetails({placeId: suggestion.place_id}, (place, status) => {
            if (status === this.google.maps.places.PlacesServiceStatus.OK) {
                callback(parseAddressFromGooglePlaceResult(place))
            }
        })
    }
}

export default AddressSuggestionEngine
