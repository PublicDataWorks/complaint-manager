import _ from 'lodash'

const getComponentOnType = (address, desired_types) => {
    const addressComponents = address.address_components

    const componentMatchesAllTypes = (addressComponent) => {
        return desired_types.every(type => addressComponent.types.includes(type))
    }

    return _.find(addressComponents, componentMatchesAllTypes)
}

const parseAddressFromGooglePlaceResult = (address) => {
    const streetNumberComponent = getComponentOnType(address, ['street_number'])
    const streetNameComponent = getComponentOnType(address, ['route'])
    const cityComponent = getComponentOnType(address, ['locality', 'political'])
    const stateComponent = getComponentOnType(address, ['administrative_area_level_1', 'political'])
    const zipCodeComponent = getComponentOnType(address, ['postal_code'])
    const countryComponent = getComponentOnType(address, ['country', 'political'])

    return {
        streetAddress: `${streetNumberComponent.long_name} ${streetNameComponent.short_name}`,
        city: cityComponent.long_name,
        state: stateComponent.short_name,
        zipCode: zipCodeComponent.short_name,
        country: countryComponent.long_name
    }
}
export default parseAddressFromGooglePlaceResult