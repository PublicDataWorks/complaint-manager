import formatAddress from "./formatAddress";

describe('format address', () => {
    test('should return empty string if null passed', () => {
        expect(formatAddress(null)).toEqual('')
    })

    test('should separate by commas each component passed', () => {
        const address = {
            streetAddress: '200 East Randolph Street',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'US'
        }

        const expectedText = '200 East Randolph Street, Chicago, IL, 60601, US'

        expect(formatAddress(address)).toEqual(expectedText)
    })

    test('should take into account missing country in between', () => {
        const address = {
            streetAddress: '200 East Randolph Street',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601'
        }

        const expectedText = '200 East Randolph Street, Chicago, IL, 60601'
        expect(formatAddress(address)).toEqual(expectedText)
    })

    test('should take into account missing zipCode in between', () => {
        const address = {
            streetAddress: '200 East Randolph Street',
            city: 'Chicago',
            state: 'IL',
            country: 'USA'
        }

        const expectedText = '200 East Randolph Street, Chicago, IL, USA'
        expect(formatAddress(address)).toEqual(expectedText)
    })

    test('should take into account missing state in between', () => {
        const address = {
            streetAddress: '200 East Randolph Street',
            city: 'Chicago',
            country: 'USA',
            zipCode: '60601'
        }

        const expectedText = '200 East Randolph Street, Chicago, 60601, USA'
        expect(formatAddress(address)).toEqual(expectedText)
    })

    test('should take into account missing city in between', () => {
        const address = {
            streetAddress: '200 East Randolph Street',
            state: 'IL',
            country: 'USA',
            zipCode: '60601'
        }

        const expectedText = '200 East Randolph Street, IL, 60601, USA'
        expect(formatAddress(address)).toEqual(expectedText)
    })
    test('should take into account missing city in between', () => {
        const address = {
            city: 'Chicago',
            state: 'IL',
            country: 'USA',
            zipCode: '60601'
        }

        const expectedText = 'Chicago, IL, 60601, USA'
        expect(formatAddress(address)).toEqual(expectedText)
    })
});