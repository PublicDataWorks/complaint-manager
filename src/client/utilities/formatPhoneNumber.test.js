import formatPhoneNumber from "./formatPhoneNumber";

describe('formatPhoneNumber', () => {
    test('should format a valid phone number', () => {
        const validPhoneNumber = '3128675309'
        const formattedNumber = formatPhoneNumber(validPhoneNumber)
        const expectedFormat = "(312) 867-5309"
        expect(formattedNumber).toEqual(expectedFormat)
    })
})