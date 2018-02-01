import sortBy from "./sortBy";

describe('sorting', () => {
    let unsortedCases
    beforeEach(() => {
        unsortedCases = [
            {
                id: 2,
                status: 'Initial',
                lastName: 'austin'
            },
            {
                id: 1,
                status: 'Active',
                lastName: 'Zeke'
            }
        ]
    });

    test('should sort by status asc', () => {

        const expectedSortedCases = [
            {
                id: 2,
                status: 'Initial',
                lastName: 'austin'
            },
            {
                id: 1,
                status: 'Active',
                lastName: 'Zeke'
            }
        ]

        const sortedCases = sortBy(unsortedCases, 'status', 'asc')

        expect(sortedCases).toEqual(expectedSortedCases)
    })

    test('should sort by status desc', () => {

        const expectedSortedCases = [
            {
                id: 1,
                status: 'Active',
                lastName: 'Zeke'
            },
            {
                id: 2,
                status: 'Initial',
                lastName: 'austin'
            }
        ]

        const sortedCases = sortBy(unsortedCases, 'status', 'desc')

        expect(sortedCases).toEqual(expectedSortedCases)
    })

    test('should sort by last name ignoring case', () => {
        const expectedSortedCases = [
            {
                id: 2,
                status: 'Initial',
                lastName: 'austin'
            },
            {
                id: 1,
                status: 'Active',
                lastName: 'Zeke'
            }
        ]

        const sortedCases = sortBy(unsortedCases, 'lastName', 'asc')

        expect(sortedCases).toEqual(expectedSortedCases)
    })
});

