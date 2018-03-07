import _ from 'lodash'

const getComponentOnType = (address, type) => {
    const addressComponents = address.address_components

    return _.find(addressComponents, (component) => (
            component.types.includes(type)
        ))
}

const parseAddressFromGooglePlaceResult = (address) => {
    const streetNumberComponent = getComponentOnType(address, 'street_number')

    return {streetNumber: streetNumberComponent.long_name}
}
export default parseAddressFromGooglePlaceResult