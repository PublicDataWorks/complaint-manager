const formatPhoneNumber = (phoneNumber) => {
    const phoneString = phoneNumber.toString()

    const areaCode = phoneString.substring(0, 3)
    const first = phoneString.substring(3, 6)
    const second = phoneString.substring(6, 10)

    return `(${areaCode}) ${first}-${second}`
}

export default formatPhoneNumber