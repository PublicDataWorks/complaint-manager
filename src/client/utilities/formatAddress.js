const formatAddress = (address) => {
    let formattedAddress = ''
    if (address) {
        const streetAddress = `${address.streetAddress || ''}`
        const city = `${address.city || ''}`
        const addressState = `${address.state || ''}`
        const zipCode = `${address.zipCode || ''}`
        const country = `${address.country || ''}`

        let addressParts =
            [
                streetAddress,
                city,
                addressState,
                zipCode,
                country,
            ].filter(part => part !== '')

        formattedAddress = addressParts.join(', ').trim()
    }

    return formattedAddress
}

export default formatAddress