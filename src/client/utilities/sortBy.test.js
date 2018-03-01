import sortBy from "./sortBy";

describe('sorting', () => {
    let unsortedCases
    beforeEach(() => {
        unsortedCases = [
            {
                id: 2,
                status: 'Initial',
                civilians: [{
                    lastName: 'austin',
                    roleOnCase: 'Primary Complainant'
                }],
                assignedTo: 'abcUser'
            },
            {
                id: 1,
                status: 'Active',
                civilians: [{
                    lastName: 'Zeke',
                    roleOnCase: 'Primary Complainant'
                }],
                assignedTo: 'DceUser'
            }
        ]
    });

    test('should sort by status asc', () => {
        const expectedSortedCases = [
            {
                id: 2,
                status: 'Initial',
                civilians: [{
                    lastName: 'austin',
                    roleOnCase: 'Primary Complainant'
                }],
                assignedTo: 'abcUser'
            },
            {
                id: 1,
                status: 'Active',
                civilians: [{
                    lastName: 'Zeke',
                    roleOnCase: 'Primary Complainant'
                }],
                assignedTo: 'DceUser'
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
                civilians: [{
                    lastName: 'Zeke',
                    roleOnCase: 'Primary Complainant'
                }],
                assignedTo: 'DceUser'
            },
            {
                id: 2,
                status: 'Initial',
                civilians: [{
                    lastName: 'austin',
                    roleOnCase: 'Primary Complainant'
                }],
                assignedTo: 'abcUser'
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
                civilians: [{
                    lastName: 'austin',
                    roleOnCase: 'Primary Complainant'
                }],
                assignedTo: 'abcUser'
            },
            {
                id: 1,
                status: 'Active',
                civilians: [{
                    lastName: 'Zeke',
                    roleOnCase: 'Primary Complainant'
                }],
                assignedTo: 'DceUser'
            }
        ]

        const sortedCases = sortBy(unsortedCases, 'lastName', 'asc')

        expect(sortedCases).toEqual(expectedSortedCases)
    })

    test('should sort by assigned to ignoring case', () => {
        const expectedSortedCases = [
            {
                id: 2,
                status: 'Initial',
                civilians: [{
                    lastName: 'austin',
                    roleOnCase: 'Primary Complainant'
                }],
                assignedTo: 'abcUser'
            },
            {
                id: 1,
                status: 'Active',
                civilians: [{
                    lastName: 'Zeke',
                    roleOnCase: 'Primary Complainant'
                }],
                assignedTo: 'DceUser'
            }
        ]

        const sortedCases = sortBy(unsortedCases, 'assignedTo', 'asc')

        expect(sortedCases).toEqual(expectedSortedCases)
    })
});

