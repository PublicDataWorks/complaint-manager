import parseAddressFromGooglePlaceResult from "../../../../utilities/parseAddressFromGooglePlaceResult";

class AddressSuggestionEngine {
    constructor(google) {
        this.google = google
        this.autoCompleteService = new google.maps.places.AutocompleteService()
        this.placeDetailsService = new google.maps.places.PlacesService(window.document.createElement('div'))
    }

    getSuggestionValue = (suggestion) => {
        return Boolean(suggestion)
            ? suggestion.description
            : ""
    }

    onFetchSuggestions = (input, callback) => {
        this.autoCompleteService.getPlacePredictions({
            input: input,
            types: ['address']
        }, (addresses) => {
            if (!addresses) {
                callback([])
            } else {
                const filteredAddresses = addresses.filter(address => address.types.includes('street_address'))
                callback(filteredAddresses)
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
