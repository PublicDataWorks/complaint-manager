class AddressSuggestionEngine {
    constructor(google){
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
        this.autoCompleteService.getPlacePredictions({input: input}, callback)
    }

    onSuggestionSelected =  (suggestion, callback) => {
        this.placeDetailsService.getDetails({placeId: suggestion.place_id}, (place, status) => {
            if (status === this.google.maps.places.PlacesServiceStatus.OK) {

                //parse details

                const address = {
                    'streetNumber': 123,
                    'streetName': 'Randolph',
                    'City': 'Chicago',
                    'State': 'IL',
                    'Zipcode': '60601'
                }
                callback(address)
            }
        })
    }
}

export default AddressSuggestionEngine